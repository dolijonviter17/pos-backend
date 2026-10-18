import express from "express";
import { Request, Response, NextFunction } from "express";
import categoriesService from "../../services/categories";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty, verifyToken } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const listCategoryByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.listCategoryByMerchantId - params not provided!",
      });
    }
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    const userAuth = verifyToken(token);
    if (!userAuth) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    const apiResponse = await categoriesService.listCategoryByMerchantId(
      req.params,
      userAuth,
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Category By Merchant Successfully",
      method: "GET",
      response: {
        offset: req.params.offset,
        limit: req.params.limit,
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createNewCategoryByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.createNewCategoryByMerchantId - headers not provided!",
      });
    }
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    const userAuth = verifyToken(token);
    if (!userAuth) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.createNewCategoryByMerchantId - body not provided!",
      });
    }

    const apiResponse = await categoriesService.createNewCategoryByMerchantId(
      req.body,
      userAuth,
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Create New Category Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategoryByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.updateCategoryByMerchantId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.updateCategoryByMerchantId - params not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "categoriesService.updateCategoryByMerchantId - body not provided!",
      });
    }
    const apiResponse = await categoriesService.updateCategoryByMerchantId(
      req.params,
      req.body,
      req.headers,
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Update Category Successfully",
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
  listCategoryByMerchantId,
  createNewCategoryByMerchantId,
  updateCategoryByMerchantId,
};
