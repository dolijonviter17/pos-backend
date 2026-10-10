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

const menusByCategory = async (requestBody: any): Promise<any> => {
  try {
    const { merchant_id, category_id, page } = requestBody;
    let offset = page ? page : 0;
    let limit = 10;
    if (!merchant_id) {
      return executionError(404, "merchant_id is empty");
    }
    let merchant_data = await pool.query(
      "SELECT * FROM m_merchants WHERE id = $1 and is_active = true",
      [merchant_id]
    );

    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }

    if (!category_id) {
      let category_by_merchat = await pool.query(
        "SELECT id, category_name FROM m_categories WHERE merchant_id = $1",
        [merchant_id]
      );
      return category_by_merchat.rows;
    }

    let category_data = await pool.query(
      "SELECT * FROM m_categories WHERE id = $1",
      [category_id]
    );

    if (category_data.rows.length === 0) {
      return executionError(404, "category not found");
    }
    let product_data_bymerchantid = await pool.query(
      "SELECT * FROM m_products WHERE merchant_id = $1 AND category_id = $2 and is_active = true ORDER BY id offset $3 limit $4",
      [merchant_id, category_id, offset, limit]
    );
    return product_data_bymerchantid.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const menusByMerchantId = async (requestBody: any): Promise<any> => {
  try {
    const { category_id, merchant_id, page } = requestBody;
    let offset = page ? page : 0;
    let limit = 10;
    if (!merchant_id) {
      return executionError(404, "merchant_id is empty");
    }
    let merchant_data = await pool.query(
      "SELECT * FROM m_merchants WHERE id = $1 and is_active = true",
      [merchant_id]
    );
    if (merchant_data.rows.length === 0) {
      return [];
    }

    if (!category_id) {
      let product_bymerchantid = await pool.query(
        "SELECT * FROM m_products WHERE merchant_id = $1 and is_active = true ORDER BY id  offset $2 limit $3",
        [merchant_id, offset, limit]
      );
      return product_bymerchantid.rows;
    }
    let product_bymerchantid_and_category = await pool.query(
      "SELECT * FROM m_products WHERE merchant_id = $1 AND category_id = $2 and is_active = true ORDER BY id  offset $3 limit $4",
      [merchant_id, category_id, offset, limit]
    );
    return product_bymerchantid_and_category.rows;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const detailProductByMerchantId = async (requestBody: any): Promise<any> => {
  try {
    const { category_id, merchant_id, product_id } = requestBody;
    if (!product_id) {
      return executionError(404, "product_id is empty");
    }
    if (!merchant_id) {
      return executionError(404, "merchant_id is empty");
    }
    if (!category_id) {
      return executionError(404, "category_id is empty");
    }
    let category_bymerchantid = await pool.query(
      "SELECT category_name, type_of_product FROM m_categories WHERE id = $1 AND merchant_id = $2",
      [category_id, merchant_id]
    );
    if (category_bymerchantid.rows.length === 0) {
      return {};
    }
    let product_bymerchantid = await pool.query(
      "SELECT * FROM m_products WHERE id = $1 AND merchant_id = $2 AND category_id = $3 and is_active = true",
      [product_id, merchant_id, category_id]
    );
    if (product_bymerchantid.rows.length === 0) {
      return {};
    }
    let data_detailproduct = {
      ...product_bymerchantid.rows[0],
      ...category_bymerchantid.rows[0],
    };
    return data_detailproduct;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const detailProductById = async (requestParams: any): Promise<any> => {
  try {
    const { product_id } = requestParams;
    if (!product_id) {
      return executionError(404, "product_id is empty");
    }
    let product_bymerchantid = await pool.query(
      "SELECT * FROM m_products WHERE id = $1 and is_active = true",
      [product_id]
    );
    if (product_bymerchantid.rows.length === 0) {
      return executionError(404, "product not found");
    }
    let data_productId = product_bymerchantid.rows[0];
    let category_bymerchantid = await pool.query(
      "SELECT id as category_id, category_name, type_of_product FROM m_categories WHERE id = $1",
      [data_productId.category_id]
    );

    let merchant_byproduct = await pool.query(
      "SELECT id as merchant_id, name as merchant_name FROM m_merchants WHERE id = $1",
      [data_productId.merchant_id]
    );

    let data_detailproduct = {
      id: data_productId.id,
      product_name: data_productId.product_name,
      description: data_productId.description,
      spesification: data_productId.spesification,
      photo: data_productId.photo,
      price: data_productId.price,
      is_discount: data_productId.is_discount,
      price_discount: data_productId.price_discount,
      percent_discount: data_productId.percent_discount,
      category: category_bymerchantid.rows[0],
      merchant: merchant_byproduct.rows[0],
    };
    return data_detailproduct;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const listProductByCategoryId = async (requestParams: any): Promise<any> => {
  try {
    const { category_id, merchant_id, limit, offset } = requestParams;
    let r_offset = offset ? offset : 0;
    let r_limit = limit ? limit : 10;
    if (!merchant_id) {
      return executionError(404, "merchant_id is empty");
    }
    if (!category_id) {
      return executionError(404, "category_id is empty");
    }

    let merchant_data = await pool.query(
      "SELECT id as merchant_id, name as merchant_name FROM m_merchants WHERE id = $1 and is_active = true",
      [merchant_id]
    );
    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }
    let data_merchant = merchant_data.rows[0];
    let category_bymerchantid = await pool.query(
      "SELECT id as category_id, category_name, type_of_product FROM m_categories WHERE id = $1 AND merchant_id = $2",
      [category_id, data_merchant.merchant_id]
    );
    if (category_bymerchantid.rows.length === 0) {
      return executionError(404, "category not found");
    }
    let data_categoory = category_bymerchantid.rows[0];
    let product_bymerchantid = await pool.query(
      "SELECT id, product_name, description, spesification, photo, price, is_discount, price_discount, percent_discount FROM m_products WHERE  category_id = $1 and is_active = true ORDER BY id  offset $2 limit $3",
      [data_categoory.category_id, r_offset, r_limit]
    );
    let data_productbycategory = product_bymerchantid.rows;
    if (data_productbycategory.length == 0) {
      return executionError(404, "product not found");
    }
    let mapData = data_productbycategory.map((e) => ({
      ...e,
      category: { ...data_categoory },
      merchant: { ...data_merchant },
    }));

    return mapData;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const createNewProductByMerchantId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    const user_token = getUserIdFromToken(authHeader);
    if (!user_token) {
      return executionError(401, "token not valid");
    }
    const {
      category_id,
      product_name,
      description,
      spesification,
      photo,
      price,
      is_discount,
      price_discount,
      percent_discount,
    } = requestBody;

    if (!price) {
      return executionError(404, "price is empty");
    }
    if (!photo) {
      return executionError(404, "photo is empty");
    }
    if (!category_id) {
      return executionError(404, "category_id is empty");
    }
    if (!product_name) {
      return executionError(404, "product_name is empty");
    }
    if (!description) {
      return executionError(404, "description is empty");
    }
    if (!spesification) {
      return executionError(404, "spesification is empty");
    }
    let curr_price_discount = 0;
    let curr_percent_discount = 0;
    if (is_discount) {
      curr_price_discount = price_discount;
      curr_percent_discount = percent_discount;
    }

    let merchant_data = await pool.query(
      "SELECT * FROM m_merchants WHERE id = $1",
      [user_token.merchant_id]
    );
    if (merchant_data.rows.length === 0) {
      return executionError(404, "merchant not found");
    }
    let category_bymerchantid = await pool.query(
      "SELECT * FROM m_categories WHERE id = $1",
      [category_id]
    );
    if (category_bymerchantid.rows.length === 0) {
      return executionError(404, "category not found");
    }
    let insert_new_product = await pool.query(
      "INSERT INTO m_products (merchant_id, category_id, product_name, description, spesification, photo, price, is_discount, price_discount, percent_discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        user_token.merchant_id,
        category_id,
        product_name,
        description,
        spesification,
        photo,
        price,
        is_discount,
        curr_price_discount,
        curr_percent_discount,
      ]
    );
    let data_productbycategory = insert_new_product.rows[0];
    return data_productbycategory;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const updateProductByMerchantId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const authHeader = requestHeaders.authorization;
    const user_token = getUserIdFromToken(authHeader);
    if (!user_token) {
      return executionError(401, "token not valid");
    }
    if (!requestBody.product_id) {
      return executionError(404, "product_id is empty");
    }
    let find_product = await pool.query(
      "SELECT * FROM m_products WHERE id = $1 AND merchant_id = $2",
      [requestBody.product_id, user_token.merchant_id]
    );
    if (find_product.rows.length === 0) {
      return executionError(404, "product not found");
    }
    const {
      category_id,
      product_name,
      description,
      spesification,
      photo,
      price,
      is_discount,
      price_discount,
      percent_discount,
    } = find_product.rows[0];
    let in_category_id = requestBody.category_id
      ? requestBody.category_id
      : category_id;
    let in_product_name = requestBody.product_name
      ? requestBody.product_name
      : product_name;
    let in_description = requestBody.description
      ? requestBody.description
      : description;
    let in_spesification = requestBody.spesification
      ? requestBody.spesification
      : spesification;
    let in_photo = requestBody.photo ? requestBody.photo : photo;
    let in_price = requestBody.price ? requestBody.price : price;
    let in_is_discount = requestBody.is_discount
      ? requestBody.is_discount
      : is_discount;
    let in_price_discount = requestBody.price_discount
      ? requestBody.price_discount
      : price_discount;
    let in_percent_discount = requestBody.percent_discount
      ? requestBody.percent_discount
      : percent_discount;
    if (!in_price) {
      return executionError(404, "price is empty");
    }
    if (!in_photo) {
      return executionError(404, "photo is empty");
    }
    if (!in_category_id) {
      return executionError(404, "category_id is empty");
    }
    if (!in_product_name) {
      return executionError(404, "product_name is empty");
    }
    if (!in_description) {
      return executionError(404, "description is empty");
    }
    if (!in_spesification) {
      return executionError(404, "spesification is empty");
    }
    let update_product = await pool.query(
      "UPDATE m_products SET category_id = $1, product_name = $2, description = $3, spesification = $4, photo = $5, price = $6, is_discount = $7, price_discount = $8, percent_discount = $9 WHERE id = $10 AND merchant_id = $11 RETURNING *",
      [
        in_category_id,
        in_product_name,
        in_description,
        in_spesification,
        in_photo,
        in_price,
        in_is_discount,
        in_price_discount,
        in_percent_discount,
        requestBody.product_id,
        user_token.merchant_id,
      ]
    );
    return update_product.rows[0];
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};
export default {
  menusByCategory,
  menusByMerchantId,
  detailProductByMerchantId,
  detailProductById,
  listProductByCategoryId,
  createNewProductByMerchantId,
  updateProductByMerchantId,
};
