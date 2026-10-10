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

const registerNewUser = async (requestBody: any): Promise<any> => {
  try {
    const { email, password, role, merchant_id } = requestBody;

    if (!email) {
      return executionError(400, "email cannot be empty");
    }
    let check_user_email = await pool.query(
      "SELECT * FROM m_users WHERE email = $1",
      [email]
    );
    let check_emailuser = check_user_email.rows;
    if (check_emailuser.length > 0) {
      return executionError(400, "email has been using, please login first");
    }
    if (!password) {
      return executionError(400, "password cannot be empty");
    }
    if (!role) {
      return executionError(400, "role cannot be empty");
    }

    if (!merchant_id) {
      return executionError(400, "merchant_id cannot be empty");
    }
    let merchant_data = await pool.query(
      "SELECT id FROM m_merchants WHERE id = $1",
      [merchant_id]
    );
    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }
    let data_role = ["Admin", "Owner", "Superadmin"];
    let check_role = data_role.find((e) => e === role);
    if (!check_role) {
      return executionError(400, "role is wrong");
    }
    let salt = randomBytes();
    let password_val = authentication(salt, password);
    let create_user = await pool.query(
      "INSERT INTO m_users (email, password, role, is_active, merchant_id, salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, password_val, check_role, true, merchant_id, salt]
    );
    let curr_user = create_user.rows[0];
    let data_response = {
      id: curr_user.id,
      email: curr_user.email,
      merchant_id: curr_user.merchant_id,
      role: curr_user.role,
    };
    return data_response;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const loginUser = async (requestBody: any): Promise<any> => {
  let { password, email } = requestBody;

  password.trim();

  if (!password) {
    return executionError(400, "password cannot empty");
  }
  if (!email) {
    return executionError(400, "email cannot empty");
  }
  const userQuery = await pool.query(
    "SELECT * FROM m_users WHERE email = $1 and is_active = true",
    [email]
  );
  if (userQuery.rows.length === 0) {
    return executionError(404, "user not found");
  }
  const curr_user = userQuery.rows[0];
  const expectHash = authentication(curr_user.salt, password);
  if (curr_user.password !== expectHash) {
    return executionError(400, "Password is wrong");
  }
  let data_response = {
    id: curr_user.id,
    email: curr_user.email,
    merchant_id: curr_user.merchant_id,
    role: curr_user.role,
  };
  let token = jwt.sign(data_response, seckretPrivate());
  let data_login_user = { token: token };
  return data_login_user;
};

export default { registerNewUser, loginUser };
