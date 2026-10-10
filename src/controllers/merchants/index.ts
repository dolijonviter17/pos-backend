import express from "express";
import { Request, Response, NextFunction } from "express";
import merchantsService from "../../services/merchants";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const registerMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "merchantsService.registerMerchant - body not provided!",
      });
    }
    const apiResponse = await merchantsService.registerMerchant(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Register Merchant Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMerchantDetailById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "merchantsService.getMerchantDetailById - params not provided!",
      });
    }
    const apiResponse = await merchantsService.getMerchantDetailById(
      req.params
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Merchant Detail Successfully",
      method: "GET",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { registerMerchant, getMerchantDetailById };
