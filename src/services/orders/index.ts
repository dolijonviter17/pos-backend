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
  capitalizeFirstLetter,
  randomBytesPayment,
} from "../../helpers";
import { pool } from "../../database/pool";
import dotenv from "dotenv";
dotenv.config(); // Load environment

import { executionError } from "../responseHandling";
import jwt, {
  Jwt,
  JwtPayload,
  Secret,
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";
import midtransClient = require("midtrans-client");
import { randomUUID, UUID } from "crypto";
// Define an interface for the expected JWT payload
interface CustomJwtPayload extends JwtPayload {
  id: string; // Adjust this according to your JWT payload structure
  email: string;
}

// ================================== // ==================

const createDataToOrderDetails = async (
  order_id: string | number,
  products: any[],
): Promise<any> => {
  try {
    // sss
    let qOrderDetail =
      "INSERT INTO t_orderdetails (order_id, product_id, quantity, price_at_order, subtotal_at_order) VALUES ";
    const values: any[] = [];
    const dataProduct = products
      .map((p: any, i: any) => {
        const idx = i * 5 + 1;
        values.push(
          order_id,
          Number(p.product_id),
          p.quantity,
          p.price_at_order,
          p.subtotal_at_order,
        );
        return `($${idx}, $${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
      })
      .join(", ");

    qOrderDetail += dataProduct + " RETURNING *";
    const insertMany = await pool.query(qOrderDetail, values);
    // sss
    let status = "Waiting";
    let today = new Date();
    // let create_payment = await pool.query(
    //   "INSERT INTO t_payments (order_id, payment_date, status) VALUES ($1, $2, $3) RETURNING *",
    //   [order_id, getDateTime(today), status]
    // );
    let data_details = {
      // payment: create_payment.rows[0],
      products: insertMany.rows,
    };
    return data_details;
  } catch (error) {
    throw error;
  }
};

const orderMenus = async (requestBody: any): Promise<any> => {
  try {
    const { products, merchant_id, customer_name, customer_no, table_no } =
      requestBody;

    if (!products || products.length === 0) {
      return executionError(400, "products cannot be empty");
    }
    if (!customer_name) {
      return executionError(400, "customer_name cannot be empty");
    }
    if (!customer_no) {
      return executionError(400, "customer_no cannot be empty");
    }
    if (!table_no) {
      return executionError(400, "table_no cannot be empty");
    }

    if (!merchant_id) {
      return executionError(404, "merchant_id is not valid");
    }
    let today = new Date();
    let order_date = getDateTime(today);
    let order_code = generateKodeOrder("PO");
    let status = "Waiting";
    var subtotal = 0;
    var grand_total = 0;
    let create_order = await pool.query(
      "INSERT INTO t_orders (merchant_id, order_date, order_code, customer_name, customer_no, table_no, status, subtotal, grand_total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        merchant_id,
        order_date,
        order_code,
        customer_name,
        customer_no,
        table_no,
        status,
        subtotal,
        grand_total,
      ],
    );
    let curr_order = create_order.rows[0];
    const product_at_order: any[] = [];
    for (let i = 0; i < products.length; i++) {
      let curr_product = products[i];
      if (
        !curr_product.hasOwnProperty("product_id") &&
        !curr_product.hasOwnProperty("quantity") &&
        !curr_product.hasOwnProperty("price_at_order")
      ) {
        return executionError(
          400,
          "product_id / quantity / price_at_order cannot be empty",
        );
      }
      let check_product = await pool.query(
        "SELECT price FROM m_products WHERE id = $1 AND merchant_id = $2",
        [curr_product.product_id, merchant_id],
      );
      if (check_product.rowCount == 0) {
        return executionError(400, "product is not available");
      }
      let subtotal_at_order =
        curr_product.quantity * check_product.rows[0].price;
      let add_req_product = {
        ...curr_product,
        order_id: curr_order.id,
        subtotal_at_order: subtotal_at_order,
      };
      product_at_order.push(add_req_product);
      grand_total += subtotal_at_order;
      subtotal += curr_product.quantity;
    }
    let update_order = await pool.query(
      "UPDATE t_orders SET subtotal = $1, grand_total = $2 WHERE id = $3 RETURNING *",
      [subtotal, grand_total, curr_order.id],
    );
    try {
      let create_order_details = await createDataToOrderDetails(
        curr_order.id,
        product_at_order,
      );
      let dataku = {
        ...create_order_details,
        order: update_order.rows[0],
      };
      return dataku;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const createOrderByMerchantId = async (
  requestBody: any,
  requestHeaders: any,
): Promise<any> => {
  try {
    const { products, merchant_id, table_no, order_type, notes } = requestBody;
    const authHeader = requestHeaders.authorization;

    if (!authHeader) return executionError(404, "token not found");
    if (!merchant_id) return executionError(400, "merchant_id cannot be empty");

    if (!products || products.length === 0)
      return executionError(400, "products cannot be empty");

    let ids_products = products.map((e: any) => e.product_id);
    if (!ids_products) return executionError(400, "products cannot be empty");

    // if (qty_products.quantity < 1) return executionError(400, "cek data aja ini mah");

    // console.log("cek data",qty_products);

    // const qty_products: number[] = products
    //   .map((e: product) => e.quantity)
    //   .filter(qty => typeof qty === 'number' && !isNaN(qty));

    // let qty_products = products.map((e: any) => e.quantity);
    const qty_products = products.map((e: { quantity: number }) => e.quantity);

    if (qty_products.some((quantity: number) => quantity <= 0)) {
      return executionError(400, "Quantity cant less then 1");
    }

    let duplicate_products = new Set(ids_products).size !== ids_products.length;
    if (duplicate_products)
      return executionError(400, "duplicate product can't available");

    let table_no_val = table_no || 1;
    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) return executionError(401, "token not valid");

    let order_type_val = order_type || 1;

    // Ambil data customer
    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id],
    );
    if (customer_data.rows.length === 0)
      return executionError(404, "customer not found");

    let customer_name = customer_data.rows[0].fullname;
    let customer_no = customer_data.rows[0].phone_number;

    // Ambil data merchant
    let merchant_data = await pool.query(
      "SELECT id, code, name, email, logo FROM m_merchants WHERE id = $1",
      [merchant_id],
    );
    if (merchant_data.rows.length === 0)
      return executionError(404, "merchant not found");

    // Ambil setting merchant
    let tax = 0;
    let admin = 0;
    let merchant_setting = await pool.query(
      "SELECT * FROM m_merchant_setting WHERE merchant_id = $1",
      [merchant_id],
    );
    if (merchant_setting.rows.length > 0) {
      tax = merchant_setting.rows[0].tax || 0;
      admin = merchant_setting.rows[0].admin || 0;
    }

    // Cek semua harga produk
    const mismatched_prices = [];
    const valid_products = [];

    for (const curr_product of products) {
      if (
        !curr_product.hasOwnProperty("product_id") ||
        !curr_product.hasOwnProperty("quantity") ||
        !curr_product.hasOwnProperty("price_at_order")
      ) {
        return executionError(
          404,
          "product_id / quantity / price_at_order cannot be empty",
        );
      }

      let check_product = await pool.query(
        "SELECT price, is_active FROM m_products WHERE id = $1 AND merchant_id = $2",
        [curr_product.product_id, merchant_id],
      );

      if (check_product.rowCount === 0) {
        return executionError(400, "product is not available");
      }

      if (!check_product.rows[0].is_active) {
        return executionError(400, "product is not active");
      }

      const current_price = check_product.rows[0].price;

      if (curr_product.price_at_order !== current_price) {
        mismatched_prices.push({
          product_id: curr_product.product_id,
          price_at_order: current_price,
        });
      }

      // Simpan juga data valid agar tidak query ulang jika lanjut
      valid_products.push({
        ...curr_product,
        current_price,
      });
    }

    if (mismatched_prices.length > 0) {
      return {
        status: 200,
        response: mismatched_prices,
      };
    }

    // Buat order baru
    let today = new Date();
    let order_code = generateKodeOrder("PO");
    let status = "Waiting";
    const uuid = randomUUID();

    let create_order = await pool.query(
      "INSERT INTO t_orders (merchant_id, order_date, order_code, customer_name, customer_no, table_no, status, subtotal, grand_total, order_type, admin, customer_id, uuid, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, $8, $9, $10, $11, $12) RETURNING *",
      [
        merchant_id,
        getDateTime(today),
        order_code,
        customer_name,
        customer_no,
        table_no_val,
        status,
        order_type_val,
        admin,
        userLogin.id,
        uuid,
        notes,
      ],
    );

    let curr_order = create_order.rows[0];
    const product_at_order: any[] = [];

    for (const product of valid_products) {
      const subtotal_at_order = product.quantity * product.current_price;

      product_at_order.push({
        product_id: product.product_id,
        quantity: product.quantity,
        price_at_order: product.current_price,
        order_id: curr_order.id,
        subtotal_at_order,
      });
    }

    // Hitung subtotal dan grand_total
    const subtotal = product_at_order.reduce(
      (sum, item) => sum + item.subtotal_at_order,
      0,
    );

    let tax_val = tax > 0 ? (subtotal * tax) / 100 : 0;
    let admin_val = admin > 0 ? (subtotal * admin) / 100 : 0;
    const delivery = 0;
    const grand_total = subtotal + tax_val + admin_val;

    // Update order
    await pool.query(
      "UPDATE t_orders SET subtotal = $1, grand_total = $2, tax = $3, delivery = $4, admin = $5 WHERE id = $6 RETURNING *",
      [subtotal, grand_total, tax_val, delivery, admin_val, curr_order.id],
    );

    // Simpan order detail
    await createDataToOrderDetails(curr_order.id, product_at_order);

    // Response akhir
    return {
      id: curr_order.id,
      uuid: uuid,
      order_code: curr_order.order_code,
      grand_total: grand_total,
      notes: notes,
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getOrdersByCustomerId = async (
  requestParams: any,
  requestHeaders: any,
): Promise<any> => {
  try {
    const { status } = requestParams;
    let status_val = status ? status : "waiting";

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (status_val != "waiting") {
      status_val = "paid";
    }

    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id],
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let customer_orders = await pool.query(
      "SELECT id, order_code, order_date, order_type, status, grand_total, subtotal as items  FROM t_orders WHERE customer_id = $1 AND status = $2 ORDER BY order_date DESC",
      [userLogin.id, capitalizeFirstLetter(status_val)],
    );
    if (customer_orders.rows.length === 0) {
      return [];
    }
    let data_order = customer_orders.rows;
    let data_response = [];
    for (let i = 0; i < data_order.length; i++) {
      let el = data_order[i];
      let customer_payment = await pool.query(
        "SELECT payment_date as paid_at FROM t_payments WHERE order_id = $1",
        [el.id],
      );
      let data_ordertype = await pool.query(
        "SELECT id, name FROM m_order_types WHERE id = $1",
        [el.order_type],
      );
      data_response.push({
        ...el,
        order_type: data_ordertype.rows[0],
        ...customer_payment.rows[0],
      });
    }

    return data_response;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};
const getOrdersDetailsByCustomerId = async (
  requestParams: any,
  requestHeaders: any,
): Promise<any> => {
  try {
    const { status, order_id } = requestParams;
    let status_val = status ? status : "waiting";

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!order_id) {
      return executionError(401, "Errors Your not Eligible");
    }
    if (status_val != "waiting") {
      status_val = "paid";
    }

    const userLogin = getUserIdFromToken(authHeader);
    if (!userLogin) {
      return executionError(401, "token not valid");
    }

    let customer_data = await pool.query(
      "SELECT * FROM m_customers WHERE id = $1",
      [userLogin.id],
    );
    if (customer_data.rows.length === 0) {
      return executionError(404, "customer not found");
    }
    let customer_orders = await pool.query(
      "SELECT id, order_code, order_date, order_type, status, grand_total, subtotal, tax, admin, delivery  FROM t_orders WHERE id = $1 AND customer_id = $2",
      [order_id, userLogin.id],
    );
    if (customer_orders.rows.length === 0) {
      return executionError(404, "Order not found");
    }
    let data_orderdetails = await pool.query(
      "SELECT t2.id, t2.product_name as name, t2.photo, t1.price_at_order as price, t1.quantity, t1.subtotal_at_order as total_price FROM t_orderdetails t1 LEFT JOIN m_products t2 ON t2.id = t1.product_id WHERE order_id = $1",
      [order_id],
    );
    let data_order = customer_orders.rows[0];
    let customer_payment = await pool.query(
      `SELECT 
     payment_date AS paid_at, 
     CASE 
       WHEN status = 'Waiting' THEN redirect_url 
       ELSE NULL 
     END AS redirect_url 
   FROM t_payments 
   WHERE order_id = $1`,
      [order_id],
    );
    let data_ordertype = await pool.query(
      "SELECT id, name FROM m_order_types WHERE id = $1",
      [order_id],
    );

    let data_response = {
      ...data_order,
      products: data_orderdetails.rows,
      order_type: data_ordertype.rows[0],
      ...customer_payment.rows[0],
    };

    return data_response;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  orderMenus,
  createOrderByMerchantId,
  getOrdersByCustomerId,
  getOrdersDetailsByCustomerId,
};
