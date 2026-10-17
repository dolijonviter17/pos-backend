import {
  authentication,
  random,
  numberPonselFormat,
  isNumberPonsel,
  randomBytes,
  getDateTime,
  generateId,
  getUserIdFromToken,
} from "../../helpers";
import { pool } from "../../database/pool";

import { executionError } from "../responseHandling";

function getCookie(
  cookieHeader: string | null,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.trim().split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue.join("="));
    }
  }

  return undefined;
}

const formatPhoneNumber = (phone: string): string => {
  // hapus karakter selain angka
  const clean = phone.replace(/\D/g, "");
  // ubah 08 -> 62
  if (clean.startsWith("08")) {
    return "62" + clean.slice(1);
  }
  // jika sudah 62
  if (clean.startsWith("62")) {
    return clean;
  }
  return "";
  // throw new Error("Format nomor ponsel tidak valid");
};

const createDataToMerchantBank = async (
  user_id: string | number,
  merchant_id: string | number,
  requestBody: any,
): Promise<any> => {
  try {
    const {
      bank_name,
      bank_no,
      province_id,
      regency_id,
      district_id,
      village_id,
      merchant_name,
      address,
    } = requestBody;
    let is_active = true;
    let today = new Date();
    let merchant_code = generateId(today, Number(user_id));
    let create_merchantbank = await pool.query(
      "INSERT INTO m_merchant_banks (merchant_id, bank_name, bank_no, is_active, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        merchant_id,
        bank_name,
        bank_no,
        is_active,
        user_id,
        user_id,
        getDateTime(today),
        getDateTime(today),
      ],
    );
    let update_curr_user = await pool.query(
      "UPDATE m_users SET merchant_id = $1, is_active = $2 WHERE id = $3 RETURNING *",
      [merchant_id, is_active, user_id],
    );
    let update_curr_merchant = await pool.query(
      "UPDATE m_merchants SET code = $1, is_active = $2, updated_at = $3 WHERE id = $4 RETURNING *",
      [merchant_code, is_active, getDateTime(today), merchant_id],
    );
    const q_data = `
      INSERT INTO m_merchant_branch (merchant_id, province_id, regency_id,
      district_id, village_id, name, address, created_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    let insert_branch = await pool.query(q_data, [
      merchant_id,
      province_id,
      regency_id,
      district_id,
      village_id,
      merchant_name,
      address,
      getDateTime(today),
    ]);
    const new_branch = insert_branch.rows[0];
    await pool.query(
      "INSERT INTO user_merchantbranch (user_id, merchant_branch_id) VALUES ($1, $2) RETURNING *",
      [user_id, new_branch.id],
    );
    let data_update = {
      user: update_curr_user.rows[0],
      merchant: update_curr_merchant.rows[0],
      merchant_bank: create_merchantbank.rows[0],
      merchant_info: new_branch,
    };
    return data_update;
  } catch (error) {
    throw error;
  }
};

const createDataMerchantBranch = async (
  user_id: string | number,
  merchant_id: string | number,
  requestBody: any,
): Promise<any> => {
  try {
    const {
      province_id,
      regency_id,
      district_id,
      village_id,
      merchantbranch_name,
      address,
    } = requestBody;
    let today = new Date();

    const q_data = `
      INSERT INTO m_merchant_branch (merchant_id, province_id, regency_id,
      district_id, village_id, name, address, created_at)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    let insert_branch = await pool.query(q_data, [
      merchant_id,
      province_id,
      regency_id,
      district_id,
      village_id,
      merchantbranch_name,
      address,
      getDateTime(today),
    ]);
    const new_branch = insert_branch.rows[0];
    await pool.query(
      "INSERT INTO user_merchantbranch (user_id, merchant_branch_id) VALUES ($1, $2) RETURNING *",
      [user_id, new_branch.id],
    );
    return new_branch;
  } catch (error) {
    throw error;
  }
};

const registerMerchant = async (requestBody: any): Promise<any> => {
  try {
    const {
      email_user,
      password,
      role,
      bank_name,
      bank_no,
      merchant_name,
      merchant_email,
      address,
    } = requestBody;

    if (!email_user) {
      return executionError(400, "email_user cannot be empty");
    }
    let check_user_email = await pool.query(
      "SELECT * FROM m_users WHERE email = $1",
      [email_user],
    );
    let check_emailuser = check_user_email.rows;
    if (check_emailuser.length > 0) {
      return executionError(400, "email has been using, please login first");
    }
    if (!password) {
      return executionError(400, "password cannot be empty");
    }
    if (!merchant_name) {
      return executionError(400, "merchant_name cannot be empty");
    }
    if (!merchant_email) {
      return executionError(400, "merchant_email cannot be empty");
    }
    if (!address) {
      return executionError(400, "address cannot be empty");
    }
    // if (!role) {
    //   return executionError(400, "role cannot be empty");
    // }
    if (!bank_name) {
      return executionError(400, "bank_name cannot be empty");
    }
    if (!bank_no) {
      return executionError(400, "bank_no cannot be empty");
    }
    let merchant_logo = "logo.png";
    let data_role = ["Admin", "Owner", "Superadmin"];
    // let check_role = data_role.find((e) => e === role);
    // if (!check_role) {
    //   return executionError(400, "role is wrong");
    // }
    let myrole = "Owner";
    let salt = randomBytes();
    let password_val = authentication(salt, password);
    let create_user = await pool.query(
      "INSERT INTO m_users (email, password, role, is_active, salt) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [email_user, password_val, myrole, false, salt],
    );
    let curr_datauser = create_user.rows[0];
    let today = new Date();
    let create_merchant = await pool.query(
      "INSERT INTO m_merchants (name, email, address, logo, is_active, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        merchant_name,
        merchant_email,
        address,
        merchant_logo,
        false,
        curr_datauser.id,
        curr_datauser.id,
        getDateTime(today),
        getDateTime(today),
      ],
    );
    let curr_datamerchant = create_merchant.rows[0];
    try {
      let update_merchant = await createDataToMerchantBank(
        curr_datauser.id,
        curr_datamerchant.id,
        requestBody,
      );
      let new_merchant = {
        ...update_merchant,
      };
      return new_merchant;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getMerchantDetailById = async (requestParams: any): Promise<any> => {
  try {
    const { merchant_id } = requestParams;
    if (!merchant_id) {
      return executionError(400, "merchant_id cannot be empty");
    }
    let merchant_data = await pool.query(
      "SELECT id, code, name, email, logo FROM m_merchants WHERE id = $1",
      [merchant_id],
    );
    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }
    let merchant_setting = await pool.query(
      "SELECT tax, admin FROM m_merchant_setting WHERE merchant_id = $1",
      [merchant_id],
    );
    if (merchant_setting.rows.length === 0) {
      return executionError(404, "merchant setting not found");
    }
    let merchant_banks = await pool.query(
      "SELECT id, bank_name, bank_no, bank_account, is_active FROM m_merchant_banks WHERE merchant_id = $1",
      [merchant_id],
    );
    let data_response = {
      ...merchant_data.rows[0],
      ...merchant_setting.rows[0],
      banks: merchant_banks.rows,
    };

    return data_response;
  } catch (error) {
    throw error;
  }
};

const createNewMerchant = async (requestBody: any): Promise<any> => {
  try {
    const {
      email,
      password,
      bank_name,
      bank_no,
      merchant_name,
      merchant_email,
      address,
      province_id,
      regency_id,
      district_id,
      village_id,
      fullname,
    } = requestBody;
    if (
      !email ||
      !password ||
      !bank_name ||
      !bank_no ||
      !merchant_name ||
      !merchant_email ||
      !address ||
      !province_id ||
      !regency_id ||
      !district_id ||
      !village_id ||
      !fullname
    ) {
      return executionError(
        400,
        "email, password, role, bank_name, bank_no, merchant_name, merchant_email, province_id, regency_id, district_id, village_id, address, fullname wajib diisi",
      );
    }
    let check_user_email = await pool.query(
      "SELECT * FROM m_users WHERE email = $1",
      [email],
    );
    let check_emailuser = check_user_email.rows;
    if (check_emailuser.length > 0) {
      return executionError(400, "email sudah digunakan");
    }
    let salt = randomBytes();
    let password_val = authentication(salt, password);
    const role = "Owner";
    let create_user = await pool.query(
      "INSERT INTO m_users (email, password, role, is_active, salt, fullname) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [email, password_val, role, false, salt, fullname],
    );
    let curr_datauser = create_user.rows[0];
    let today = new Date();
    let create_merchant = await pool.query(
      "INSERT INTO m_merchants (name, email, address, is_active, created_by, updated_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        merchant_name,
        merchant_email,
        address,
        false,
        curr_datauser.id,
        curr_datauser.id,
        getDateTime(today),
        getDateTime(today),
      ],
    );
    let curr_datamerchant = create_merchant.rows[0];
    try {
      let update_merchant = await createDataToMerchantBank(
        curr_datauser.id,
        curr_datamerchant.id,
        requestBody,
      );

      return update_merchant;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getMerchantInfo = async (requestParams: any): Promise<any> => {
  try {
    const { merchant_id } = requestParams;
    if (!merchant_id) {
      return executionError(400, "merchant_id cannot be empty");
    }
    const data_merchant = await pool.query(
      "SELECT id AS merchant_id, code, name as merchant_name, email as merchant_email, logo, is_active, created_at, updated_at  FROM m_merchants WHERE id = $1",
      [merchant_id],
    );

    let data_response = {
      data_merchant,
    };

    return data_response;
  } catch (error) {
    throw error;
  }
};

const getMerchantBranchByMerchantId = async (cookies: any): Promise<any> => {
  try {
    const token = cookies.token;
    if (!token) {
      return executionError(404, "token not found");
    }
    const userLogin = getUserIdFromToken(token);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }
    const data_merchant = await pool.query(
      "SELECT * FROM m_merchant_branch WHERE id = $1",
      [userLogin.merchant_id],
    );

    return data_merchant.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const createNewMerchantBranch = async (
  requestBody: any,
  userAuth: any,
): Promise<any> => {
  try {
    const { merchant_id } = userAuth;
    const {
      email,
      address,
      province_id,
      regency_id,
      district_id,
      village_id,
      merchantbranch_name,
      phone,
      fullname,
    } = requestBody;
    if (
      !fullname ||
      !email ||
      !address ||
      !province_id ||
      !regency_id ||
      !district_id ||
      !village_id ||
      !merchantbranch_name ||
      !phone
    ) {
      return executionError(
        404,
        "email, role, bank_name, bank_no, merchant_name, merchant_email, province_id, regency_id, district_id, village_id, address wajib diisi",
      );
    }

    const format_number_phone = formatPhoneNumber(phone);
    let check_user_phone = await pool.query(
      "SELECT * FROM m_users WHERE phone = $1",
      [format_number_phone],
    );
    let check_phoneuser = check_user_phone.rows;
    if (check_phoneuser.length > 0) {
      return executionError(401, "phone sudah digunakan");
    }

    let check_user_email = await pool.query(
      "SELECT * FROM m_users WHERE email = $1",
      [email],
    );
    let check_emailuser = check_user_email.rows;
    if (check_emailuser.length > 0) {
      return executionError(401, "email sudah digunakan");
    }
    let salt = randomBytes();
    let password_val = authentication(salt, "Password123");
    const role = "Admin";
    let create_user = await pool.query(
      "INSERT INTO m_users (fullname, email, phone, password, role, is_active, salt, merchant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        fullname,
        email,
        format_number_phone,
        password_val,
        role,
        true,
        salt,
        merchant_id,
      ],
    );
    let curr_datauser = create_user.rows[0];
    try {
      let update_merchant = await createDataMerchantBranch(
        curr_datauser.id,
        merchant_id,
        requestBody,
      );
      return update_merchant;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  registerMerchant,
  getMerchantDetailById,
  createNewMerchant,
  getMerchantInfo,
  getMerchantBranchByMerchantId,
  createNewMerchantBranch,
};
