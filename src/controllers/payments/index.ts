import express from "express";
import { Request, Response, NextFunction } from "express";
import paymentsService from "../../services/payments";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty } from "../../helpers";

const getPaymentGatewayByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "paymentsService.getPaymentGatewayByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "paymentsService.getPaymentGatewayByCustomerId -  body not provided!",
      });
    }
    const apiResponse = await paymentsService.getPaymentGatewayByCustomerId(
      req.body,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Payment Order Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getVerificationPaymentByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "paymentsService.getVerificationPaymentByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "paymentsService.getVerificationPaymentByCustomerId -  body not provided!",
      });
    }
    const apiResponse =
      await paymentsService.getVerificationPaymentByCustomerId(
        req.body,
        req.headers
      );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Verification Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleMidtransNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await paymentsService.handleMidtransNotification(
      req.body,
      req.headers
    );

    return res.status(200).json({
      message: "Notification processed successfully",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getMidTransNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // if (isBodyEmpty(req.params)) {
    //   return res.status(StatusCodes.PRECONDITION_FAILED).json({
    //     message:
    //       "paymentsService.getMidTransNotification -  params not provided!",
    //   });
    // }
    const apiResponse = await paymentsService.getMidTransNotification(req.body);
    console.log("apiResponse", apiResponse);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: "success",
      message: "OK",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    console.log("error 1", error);
    next(error);
  }
};

export default {
  getPaymentGatewayByCustomerId,
  getVerificationPaymentByCustomerId,
  handleMidtransNotification,
  getMidTransNotification,
};
