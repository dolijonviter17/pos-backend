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
import crypto from "crypto";

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

const getPaymentGatewayByCustomerId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { order_id } = requestBody;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!order_id) {
      return executionError(401, "Errors Your not Eligible");
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
    let customer_orders = await pool.query(
      "SELECT id, order_code, order_date, order_type, status, grand_total, subtotal, tax, admin, delivery, uuid  FROM t_orders WHERE id = $1 AND customer_id = $2",
      [order_id, userLogin.id]
    );
    if (customer_orders.rows.length === 0) {
      return executionError(404, "Order not found");
    }
    let data_orderdetails = await pool.query(
      "SELECT t2.id, t2.product_name as name, t1.price_at_order as price, t1.quantity FROM t_orderdetails t1 LEFT JOIN m_products t2 ON t2.id = t1.product_id WHERE order_id = $1",
      [order_id]
    );
    let data_merchantsetting = await pool.query(
      "SELECT * FROM m_merchant_setting where merchant_id = 1"
    );
    let data_order = customer_orders.rows[0];
    let data_userlogin = customer_data.rows[0];
    let data_merchant = data_merchantsetting.rows[0];

    // new
    let midtrans_req = {
      transaction_details: {
        order_id: data_order.uuid,
        gross_amount: data_order.grand_total,
      },
      customer_details: {
        first_name: "An.",
        last_name: data_userlogin.fullname,
        email: data_userlogin.email,
        phone: data_userlogin.phone_number,
      },
      item_details: [
        ...data_orderdetails.rows,
        {
          id: "TAX",
          name: "Pajak " + data_merchant.tax + "%",
          price: data_order.tax,
          quantity: 1,
        },
        {
          id: "ADMIN",
          name: "Admin " + data_merchant.admin + "%",
          price: data_order.admin,
          quantity: 1,
        },
      ],
      tax: data_order.tax,
      admin: data_order.admin,
      delivery: data_order.delivery,
      grand_total: data_order.grand_total,
      // callbacks: {
      //   finish: `${process.env.SUB_DOMAIN}/order-status?transaction_id=${data_order.uuid}`,
      //   error: `${process.env.SUB_DOMAIN}/order-status?transaction_id=${data_order.uuid}`,
      //   pending: `${process.env.SUB_DOMAIN}/order-status?transaction_id=${data_order.uuid}`,
      // },
    };

    // new
    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const transaction_midtrans = await snap.createTransaction(midtrans_req);
    transaction_midtrans.order_id = data_order.uuid;

    if (transaction_midtrans.redirect_url) {
      let today = new Date();
      let create_order = await pool.query(
        "INSERT INTO t_payments (order_id, status,token,redirect_url, uuid) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
          data_order.id,
          "Waiting",
          transaction_midtrans.token,
          transaction_midtrans.redirect_url,
          data_order.uuid,
        ]
      );
    }

    return transaction_midtrans;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const getVerificationPaymentByCustomerId = async (
  requestBody: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { password } = requestBody;

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    if (!password) {
      return executionError(400, "Password cant be empty");
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
    const expectHash = authentication(user.salt, password);
    if (user.password !== expectHash) {
      return executionError(400, "Password is wrong");
    }
    let data_response = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    };
    return data_response;
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

const handleMidtransNotification = async (
  requestParams: any,
  requestHeaders: any
): Promise<any> => {
  const authHeader = requestHeaders.authorization;
  const { uuid } = requestParams;
  if (!authHeader) {
    return executionError(404, "token not found");
  }
  if (!uuid) {
    return executionError(400, "Password cant be empty");
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
    throw new Error("Customer not found in database");
  }

  let oder_by_customer_id = await pool.query(
    "SELECT uuid FROM t_orders WHERE id = $1 AND uuid = $2",
    [userLogin.id, uuid]
  );
  const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  // Dapatkan status transaksi dari Midtrans
  const statusResponse = await core.transaction.notification(requestParams);

  const {
    order_id,
    transaction_status,
    fraud_status,
    transaction_time,
    payment_type,
  } = statusResponse;

  // Ambil ID dari t_orders berdasarkan UUID (order_id dari Midtrans)
  const findOrder = await pool.query(
    "SELECT id FROM t_orders WHERE uuid = $1",
    [order_id]
  );

  if (findOrder.rowCount === 0) {
    throw new Error("Order not found in database");
  }

  const orderId = findOrder.rows[0].id;

  // Update status pembayaran di t_payments
  let data_payment = await pool.query(
    `UPDATE t_payments
     SET status = $1,
         fraud_status = $2,
         payment_type = $3,
         transaction_time = $4
     WHERE order_id = $5`,
    [transaction_status, fraud_status, payment_type, transaction_time, orderId]
  );

  return data_payment.rows[0];
};

export const getMidTransNotification = async (
  requestBody: any
): Promise<any> => {
  const orderUuid = requestBody.order_id;
  const SERVER_KEY_MIDTRANS = process.env.MIDTRANS_SERVER_KEY!;
  const { transaction_id, order_id, status_code, gross_amount, signature_key } =
    requestBody;

  console.log("typeof order_id", typeof requestBody.order_id);
  console.log("typeof transaction_id", typeof requestBody.transaction_id);

  console.log("requestBody", requestBody);

  const hash = crypto
    .createHash("sha512")
    .update(
      transaction_id +
        order_id +
        status_code +
        gross_amount +
        SERVER_KEY_MIDTRANS
    )
    .digest("hex");
  console.log("hash", hash);
  console.log("signature_key", signature_key);

  if (signature_key !== hash) {
    return executionError(400, "Signature key is not valid");
  }

  if (!orderUuid) return executionError(400, "order_id is required");
  console.log("orderUuid", orderUuid);

  const orderResult = await pool.query(
    "SELECT id FROM t_orders WHERE uuid = $1",
    [orderUuid]
  );
  console.log("orderResult", orderResult);

  if (orderResult.rows.length === 0) {
    return executionError(404, "Order not found");
  }

  const transactionStatus = requestBody.transaction_status;
  const fraudStatus = requestBody.fraud_status;
  const parsedCallback = JSON.stringify(requestBody);
  console.log("parsedCallback", parsedCallback);

  let updateQuery;
  let updateValues;

  // Handling berdasarkan status dari dokumentasi Midtrans
  if (transactionStatus === "capture") {
    if (fraudStatus === "accept") {
      updateQuery = `
        UPDATE t_payments SET callback_request = $1, status = 'success'
        WHERE uuid = $2 RETURNING *`;
      updateValues = [parsedCallback, orderUuid];
    } else {
      updateQuery = `
        UPDATE t_payments SET callback_request = $1, status = 'challenge'
        WHERE uuid = $2 RETURNING *`;
      updateValues = [parsedCallback, orderUuid];
    }
  } else if (transactionStatus === "settlement") {
    updateQuery = `
      UPDATE t_payments SET callback_request = $1, status = 'success', payment_date = $2
      WHERE uuid = $3 RETURNING *`;
    updateValues = [parsedCallback, requestBody.settlement_time, orderUuid];
  } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
    updateQuery = `
      UPDATE t_payments SET callback_request = $1, status = 'failure'
      WHERE uuid = $2 RETURNING *`;
    updateValues = [parsedCallback, orderUuid];
  } else if (transactionStatus === "pending") {
    updateQuery = `
      UPDATE t_payments SET callback_request = $1, status = 'pending'
      WHERE uuid = $2 RETURNING *`;
    updateValues = [parsedCallback, orderUuid];
  } else {
    return executionError(
      400,
      `Unhandled transaction status: ${transactionStatus}`
    );
  }

  const updatedPayment = await pool.query(updateQuery, updateValues);

  await pool.query(`UPDATE t_orders SET status = $1 WHERE uuid = $2`, [
    transactionStatus,
    orderUuid,
  ]);

  return updatedPayment.rows[0];
};

export default {
  getPaymentGatewayByCustomerId,
  getVerificationPaymentByCustomerId,
  handleMidtransNotification,
  getMidTransNotification,
};
