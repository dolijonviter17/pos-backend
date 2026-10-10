import express from "express";
import { Request, Response, NextFunction } from "express";
import uploadsService from "../../services/uploads";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty } from "../../helpers";

const uploadsProductByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "uploadsService.uploadsProductByMerchantId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.file)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "uploadsService.uploadsProductByMerchantId -  file not provided!",
      });
    }
    const apiResponse = await uploadsService.uploadsProductByMerchantId(
      req.file,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Upload Product Image Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadsProductByMerchantId,
};
