import express from "express";
import { Request, Response, NextFunction } from "express";
import ordersService from "../../services/orders";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const orderMenus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "ordersService.orderMenus - body not provided!",
      });
    }
    const apiResponse = await ordersService.orderMenus(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Order Product Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createOrderByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "ordersService.createOrderByMerchantId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "ordersService.createOrderByMerchantId -  body not provided!",
      });
    }
    const apiResponse = await ordersService.createOrderByMerchantId(
      req.body,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }

    if (apiResponse.status === 200) {
      return res.status(200).json({
        status: 200,
        message: "Price was updated",
        method: "POST",
        response: apiResponse.response,
      });
    }

    return res.status(201).json({
      status: 201,
      message: "Request Order Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "ordersService.getOrdersByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "ordersService.getOrdersByCustomerId -  body not provided!",
      });
    }
    const apiResponse = await ordersService.getOrdersByCustomerId(
      req.params,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "List Order Successfully",
      method: "GET",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getOrdersDetailsByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "ordersService.getOrdersDetailsByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "ordersService.getOrdersDetailsByCustomerId -  params not provided!",
      });
    }
    const apiResponse = await ordersService.getOrdersDetailsByCustomerId(
      req.params,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Details Order Successfully",
      method: "GET",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getOrderStatusByTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { order_id, status_code, transaction_id, transaction_status } =
      req.query;

    if (!order_id || !status_code || !transaction_id || !transaction_status) {
      return res.status(400).json({
        message: "Missing required query parameters.",
      });
    }

    const order = await pool.query(
      "SELECT id, order_code, order_date, order_type, status, grand_total, subtotal, tax, admin, delivery FROM t_orders WHERE id = $1",
      [order_id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderDetails = await pool.query(
      `SELECT t2.id, t2.product_name as name, t2.photo, t1.price_at_order as price, 
              t1.quantity, t1.subtotal_at_order as total_price 
       FROM t_orderdetails t1 
       LEFT JOIN m_products t2 ON t2.id = t1.product_id 
       WHERE order_id = $1`,
      [order_id]
    );

    const paymentData = await pool.query(
      `SELECT 
        payment_date AS paid_at, 
        CASE 
          WHEN status = 'Waiting' THEN redirect_url 
          ELSE NULL 
        END AS redirect_url 
       FROM t_payments 
       WHERE order_id = $1`,
      [order_id]
    );

    const orderTypeData = await pool.query(
      "SELECT id, name FROM m_order_types WHERE id = $1",
      [order.rows[0].order_type]
    );

    const data_response = {
      ...order.rows[0],
      products: orderDetails.rows,
      order_type: orderTypeData.rows[0],
      ...paymentData.rows[0],
      midtrans: {
        order_id,
        status_code,
        transaction_id,
        transaction_status,
      },
    };

    return res.status(200).json({
      status: 200,
      message: "Order status retrieved successfully",
      response: data_response,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  orderMenus,
  createOrderByMerchantId,
  getOrdersByCustomerId,
  getOrdersDetailsByCustomerId,
  getOrderStatusByTransaction,
};
