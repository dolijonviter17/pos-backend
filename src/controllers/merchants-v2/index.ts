import express from "express";
import { Request, Response, NextFunction } from "express";
import merchantsV2Service from "../../services/merchants-v2";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const createNewMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "merchantsService.registerMerchant - body not provided!",
      });
    }
    const apiResponse = await merchantsV2Service.createNewMerchant(req.body);
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

const getMerchantInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "merchantsV2Service.getMerchantInfo - params not provided!",
      });
    }
    const apiResponse = await merchantsV2Service.getMerchantInfo(req.params);
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

export default { createNewMerchant, getMerchantInfo };
