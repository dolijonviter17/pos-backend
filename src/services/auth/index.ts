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
const bcrypt = require("bcrypt");

const userInformation = async (requestHeaders: any) => {
  try {
    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(401, "token  not found");
    }
    const data = getUserIdFromToken(authHeader);
    if (!data) {
      return executionError(401, "token not valid");
    }
    const findUser = await pool.query("SELECT * FROM users where id = $1", [
      data.id,
    ]);

    if (findUser.rows.length === 0) {
      return executionError(404, "user not found");
    }
    return findUser.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};
const loginUser = async (requestBody: any): Promise<any> => {
  try {
    const { email } = requestBody;
    if (!email) {
      return executionError(400, "email cannot be empty");
    }

    const findUser = await pool.query(
      "SELECT * FROM m_customers where email = $1",
      [email],
    );
    if (findUser.rows.length === 0) {
      return executionError(404, "wrong email please register first");
    }
    const user = findUser.rows[0];
    let user_login = {
      id: user.id,
      email: user.email,
      merchant_id: user.merchant_id,
    };
    const token = jwt.sign(user_login, seckretPrivate());

    return {
      user: user_login,
      token,
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};
const createNewUser = async (requestBody: any): Promise<any> => {
  try {
    const { fullname, email, phone_number, password, password_confirm, photo } =
      requestBody;

    if (!email || email.trim() === "") {
      return executionError(400, "email cannot empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return executionError(400, "must be format email with @");
    }

    if (!password || password.length < 6) {
      return executionError(400, "password at least 6 characters");
    }

    if (password !== password_confirm) {
      return executionError(
        400,
        "confirm password must be match with password",
      );
    }

    if (!fullname || fullname.trim() === "") {
      return executionError(400, "fullname cannot empty");
    }

    if (!phone_number || phone_number.trim() === "") {
      return executionError(400, "phone number cannot empty");
    }

    // PHONE NUMBER tidak boleh kosong
    if (!phone_number || phone_number.trim() === "") {
      return executionError(400, "phone number cannot empty");
    }

    // PHONE NUMBER harus angka
    const isValidNumber = /^\d+$/.test(phone_number);
    if (!isValidNumber) {
      return executionError(400, "phone number must number only");
    }

    if (phone_number.length < 10 || phone_number.length > 13) {
      return executionError(
        400,
        "phone number must be between 10 to 13 characters",
      );
    }

    const findUser = await pool.query(
      "SELECT * FROM m_customers where email = $1",
      [email],
    );
    if (findUser.rows.length > 0) {
      return executionError(400, "email is has been using, not valid");
    }

    const findUserByTelepon = await pool.query(
      "SELECT * FROM m_customers where phone_number = $1",
      [phone_number],
    );
    if (findUserByTelepon.rows.length > 0) {
      return executionError(400, "The phone number is already registered");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let salt = randomBytes();
    let password_val = authentication(salt, password);

    let qusers =
      "INSERT INTO m_customers (fullname, email, phone_number, password, photo,salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const create = await pool.query(qusers, [
      fullname,
      email,
      phone_number,
      password_val,
      photo,
      salt,
    ]);

    const user_login = create.rows[0];
    delete user_login.password;
    const token = jwt.sign(
      { id: user_login.id, email: user_login.email },
      seckretPrivate(),
    );
    return {
      user_login,
      token,
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const createNewMerchant = async (requestBody: any): Promise<any> => {
  try {
    const { username, first_name, last_name, email, number_phone, password } =
      requestBody;

    if (
      !username ||
      !email ||
      !first_name ||
      !last_name ||
      !number_phone ||
      !password
    ) {
      return executionError(
        400,
        "username / first_name / last_name / email / password / number_phone. cannot be empty",
      );
    }
    const numberPhone = numberPonselFormat(number_phone);
    const isValidNumber = isNumberPonsel(numberPhone);
    if (!isValidNumber) {
      return executionError(404, "number_phone is not valid");
    }
    const findUser = await pool.query(
      "SELECT * FROM users_tb where email = $1",
      [email],
    );
    if (findUser.rows.length > 0) {
      return executionError(404, "email is has been using, not valid");
    }
    let qusers =
      "INSERT INTO users_tb (username, first_name, last_name, email, number_phone, password, salt, is_merchant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const salt_val = randomBytes();
    const password_val = authentication(salt_val, password);
    const create = await pool.query(qusers, [
      username,
      first_name,
      last_name,
      email,
      number_phone,
      password_val,
      salt_val,
      true,
    ]);

    const user_login = create.rows[0];

    let q_merchat =
      "INSERT INTO merchants_tb (name, user_id) VALUES ($1, $2) RETURNING *";
    let mc_name = `${first_name} ${last_name} Merchant`;
    const merchant = await pool.query(q_merchat, [
      mergeStringWithCharacter(mc_name),
      user_login.id,
    ]);
    const token = jwt.sign(
      { id: user_login.id, email: user_login.email },
      seckretPrivate(),
    );
    return {
      user_login,
      merchant: merchant.rows[0],
      token,
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const logoutUser = async (requestHeaders: any): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(401, "token  not found");
    }
    const data = getUserIdFromToken(authHeader);
    if (!data) {
      return executionError(401, "token not valid");
    }
    const findUser = await pool.query("SELECT * FROM users where id = $1", [
      data.id,
    ]);

    if (findUser.rows.length === 0) {
      return executionError(404, "user not found");
    }
    const loginuser = await pool.query(
      "UPDATE  users  SET remember_token = $1, updated_at = $2 WHERE id = $3 RETURNING *",
      [null, getDateTime(getDateMaximum()), findUser.rows[0].id],
    );
    return loginuser.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

// ================================== // ==================

const registerWithGoogle = async (requestBody: any): Promise<any> => {
  try {
    const { username, first_name, last_name, email, number_phone, password } =
      requestBody;

    if (
      !username ||
      !email ||
      !first_name ||
      !last_name ||
      !number_phone ||
      !password
    ) {
      return executionError(
        400,
        "username / first_name / last_name / email / password / number_phone. cannot be empty",
      );
    }
    const numberPhone = numberPonselFormat(number_phone);
    const isValidNumber = isNumberPonsel(numberPhone);
    if (!isValidNumber) {
      return executionError(404, "number_phone is not valid");
    }
    const findUser = await pool.query(
      "SELECT * FROM users_tb where email = $1",
      [email],
    );
    if (findUser.rows.length > 0) {
      return executionError(404, "email is has been using, not valid");
    }
    let qusers =
      "INSERT INTO users_tb (username, first_name, last_name, email, number_phone, password, salt, is_merchant) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
    const salt_val = randomBytes();
    const password_val = authentication(salt_val, password);
    const create = await pool.query(qusers, [
      username,
      first_name,
      last_name,
      email,
      number_phone,
      password_val,
      salt_val,
      true,
    ]);

    const user_login = create.rows[0];

    let q_merchat =
      "INSERT INTO merchants_tb (name, user_id) VALUES ($1, $2) RETURNING *";
    let mc_name = `${first_name} ${last_name} Merchant`;
    const merchant = await pool.query(q_merchat, [
      mergeStringWithCharacter(mc_name),
      user_login.id,
    ]);
    const token = jwt.sign(
      { id: user_login.id, email: user_login.email },
      seckretPrivate(),
    );
    return {
      user_login,
      merchant: merchant.rows[0],
      token,
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};
export default {
  createNewUser,
  loginUser,
  userInformation,
  createNewMerchant,
  logoutUser,
};
