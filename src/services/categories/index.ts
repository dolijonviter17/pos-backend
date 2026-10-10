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

// Define an interface for the expected JWT payload

// ================================== // ==================

const listCategoryByMerchantId = async (requestParams: any): Promise<any> => {
  try {
    const { merchant_id, offset, limit } = requestParams;
    let r_offset = offset ? offset : 0;
    let r_limit = limit ? limit : 10;
    if (!merchant_id) {
      return executionError(404, "merchant_id is empty");
    }
    let merchant_data = await pool.query(
      "SELECT id as merchant_id, name as merchant_name  FROM m_merchants WHERE id = $1 and is_active = true",
      [merchant_id]
    );

    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }
    let category_data = await pool.query(
      "SELECT * FROM m_categories WHERE merchant_id = $1 ORDER BY id  offset $2 limit $3",
      [merchant_id, r_offset, r_limit]
    );
    if (category_data.rows.length === 0) {
      return executionError(404, "category not found");
    }

    return category_data.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const createNewCategoryByMerchantId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    const user_token = getUserIdFromToken(authHeader);
    if (!user_token) {
      return executionError(401, "token not valid");
    }
    const { category_name } = requestBody;

    if (!category_name) {
      return executionError(404, "category_name is empty");
    }
    let type_of_product = mergeStringWithCharacter(category_name);
    let category_data = await pool.query(
      "SELECT * FROM m_categories WHERE type_of_product = $1 AND merchant_id = $2",
      [type_of_product, user_token.merchant_id]
    );
    if (category_data.rows.length > 0) {
      return executionError(404, "category was created");
    }

    let insert_new_category = await pool.query(
      "INSERT INTO m_categories (category_name, type_of_product, merchant_id) VALUES ($1, $2, $3) RETURNING *",
      [category_name, type_of_product, user_token.merchant_id]
    );
    return insert_new_category.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const updateCategoryByMerchantId = async (
  requestParams: any,
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    const user_token = getUserIdFromToken(authHeader);
    if (!user_token) {
      return executionError(401, "token not valid");
    }

    if (!requestParams.category_id) {
      return executionError(404, "category_id is empty");
    }
    let category_data = await pool.query(
      "SELECT * FROM m_categories WHERE id = $1 AND merchant_id = $2",
      [requestParams.category_id, user_token.merchant_id]
    );
    if (category_data.rows.length == 0) {
      return executionError(404, "category was created");
    }
    const { category_name } = category_data.rows[0];
    let in_category_name = requestBody.category_name
      ? requestBody.category_name
      : category_name;
    if (!in_category_name) {
      return executionError(404, "category_name is empty");
    }
    let in_type_of_product = mergeStringWithCharacter(in_category_name);

    let update_category = await pool.query(
      "UPDATE m_categories SET category_name = $1, type_of_product = $2 WHERE id = $3 AND merchant_id = $4 RETURNING *",
      [
        in_category_name,
        in_type_of_product,
        requestParams.category_id,
        user_token.merchant_id,
      ]
    );
    return update_category.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  listCategoryByMerchantId,
  createNewCategoryByMerchantId,
  updateCategoryByMerchantId,
};
