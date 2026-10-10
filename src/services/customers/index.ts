import {
  authentication,
  random,
  numberPonselFormat,
  isNumberPonsel,
  randomBytes,
  getDateTime,
  getDateMaximum,
  seckretPrivate,
  mergeStringWithCharacter,
  bcryptCsfPassword,
  generateKodeOrder,
  getUserIdFromToken,
} from "../../helpers";
import { pool } from "../../database/pool";

import { executionError } from "../responseHandling";
import jwt, {
  Jwt,
  JwtPayload,
  Secret,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";

const registerWithGoogle = async (requestBody: any): Promise<any> => {
  try {
    const { email, password, fullname, phone_number, photo } = requestBody;
    let check_user_email = await pool.query(
      "SELECT email FROM m_customers WHERE email = $1",
      [email]
    );
    let check_emailuser = check_user_email.rows;
    if (check_emailuser.length > 0) {
      return executionError(400, "email has been using, please login first");
    }
    var number_phone = numberPonselFormat(phone_number);
    let check_format_phone = isNumberPonsel(number_phone);
    if (!check_format_phone) {
      return executionError(400, "phone is not valid");
    }
    let check_user_phone = await pool.query(
      "SELECT phone_number FROM m_customers WHERE phone_number = $1",
      [number_phone]
    );
    let check_phoneuser = check_user_phone.rows;
    if (check_phoneuser.length > 0) {
      return executionError(
        400,
        "phone_number has been using, please login first"
      );
    }

    let salt = randomBytes();
    let password_val = authentication(salt, password);
    let create_user = await pool.query(
      "INSERT INTO m_customers (fullname, email, password, phone_number, photo, is_active, salt) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [fullname, email, password_val, number_phone, photo, true, salt]
    );
    let curr_datauser = create_user.rows[0];
    return curr_datauser;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const loginWithGoogle = async (requestBody: any): Promise<any> => {
  try {
    const { email } = requestBody;
    if (!email) {
      return executionError(400, "email cannot be empty");
    }
    const findUser = await pool.query(
      "SELECT * FROM m_customers where email = $1",
      [email]
    );
    if (findUser.rows.length === 0) {
      return { token: null };
    }
    const user = findUser.rows[0];
    let user_login = {
      id: user.id,
      email: user.email,
    };
    let token = jwt.sign(user_login, seckretPrivate());
    let data_login_customer = { token: token };
    return data_login_customer;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const profileCustomer = async (requestHeaders: any) => {
  try {
    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    const data = getUserIdFromToken(authHeader);
    if (!data) {
      return executionError(401, "token not valid");
    }
    const findUser = await pool.query(
      "SELECT id, fullname, email, phone_number, is_active, photo FROM m_customers where id = $1",
      [data.id]
    );

    if (findUser.rows.length === 0) {
      return executionError(404, "user not found");
    }
    return findUser.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const updateDataCustomerById = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { fullname, phone_number, photo } = requestBody;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    
    if (!fullname || fullname.trim() === "") {
      return executionError(400, "fullname cannot empty");
    }

    if (!phone_number || phone_number.trim() === "") {
      return executionError(400, "phone number cannot empty");
    }
    if (!photo || photo.trim() === "") {
      return executionError(400, "photo cannot empty");
    }
    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }
    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id]
    );

    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let user = customer_data.rows[0];
    var number_phone = numberPonselFormat(phone_number);
    let check_format_phone = isNumberPonsel(number_phone);
    if (!check_format_phone) {
      return executionError(400, "phone number must number only");
    }
    if (numberPonselFormat(user.phone_number) !== number_phone) {
      let check_unique_phone = await pool.query(
        "SELECT phone_number FROM m_customers WHERE phone_number = $1",
        [number_phone]
      );
      if (check_unique_phone.rows.length > 0) {
        return executionError(400, "phone number has been using");
      }
    }
    let update = await pool.query(
      "UPDATE m_customers SET fullname = $1, phone_number = $2, photo = $3 WHERE id = $4 RETURNING fullname, phone_number, photo",
      [fullname, number_phone, photo, userLogin.id]
    );
    return update.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const updatePassword = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {

  let {password, password_confirm} = requestBody;

  const authHeader = requestHeaders.authorization;
  if (!authHeader) {
    return executionError(404, "token not found")
  }

  password.trim()

  if (!password) {
    return executionError(400, "password cannot empty")
  }

  if (!password_confirm) {
    return executionError(400, "password confirm cannot empty")
  }

  if (password !== password_confirm) {
    return executionError(400, "Confirm password must be match with password")
  }

  if (password.length <= 6) {
    return executionError(400, "Password at least 6 characters")
  }

  const userLogin = getUserIdFromToken(authHeader)
  if (!userLogin) {
    return executionError(401, "token not valid")
  }

  const customerQuery = await pool.query("SELECT password, salt FROM m_customers WHERE id = $1 and is_active = true", [userLogin.id])
  if (customerQuery.rows.length === 0) {
    return executionError(404, "user not found")
  }

  const customer = customerQuery.rows[0]
  const currentPassword = customer.password
  const newPassword = authentication(customer.salt, password)

  if (currentPassword === newPassword) {
    return executionError(400, "new password is same with previous password")
  }

  const salt = randomBytes()
  const passwordVal = authentication(salt, password)

  const update = await pool.query("update m_customers set password = $1, salt = $2 where id = $3 returning *", [passwordVal, salt, userLogin.id])

  return update.rows[0]
}

export default {
  registerWithGoogle,
  loginWithGoogle,
  profileCustomer,
  updateDataCustomerById,
  updatePassword
};
