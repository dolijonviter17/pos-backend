import express from "express";
import { Request, Response, NextFunction } from "express";
import productsService from "../../services/products";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty, verifyToken } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const menusByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "productsService.menusByCategory - body not provided!",
      });
    }
    const apiResponse = await productsService.menusByCategory(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Request Product Successfully",
      method: "GET",
      response: {
        page: 1,
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const menusByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "productsService.menusByMerchantId - body not provided!",
      });
    }
    const apiResponse = await productsService.menusByMerchantId(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Request Product Successfully",
      method: "GET",
      response: {
        page: 1,
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const detailProductByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.detailProductByMerchantId - body not provided!",
      });
    }
    const apiResponse = await productsService.detailProductByMerchantId(
      req.body,
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Detail Product Successfully",
      method: "GET",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const detailProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "productsService.detailProductById - params not provided!",
      });
    }
    const apiResponse = await productsService.detailProductById(req.params);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Detail Product Successfully",
      method: "GET",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listProductByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.listProductByCategoryId - params not provided!",
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
    const apiResponse = await productsService.listProductByCategoryId(
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
      message: "Product By Category Successfully",
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

const createNewProductByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.createNewProductByMerchantId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.createNewProductByMerchantId - body not provided!",
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
    const apiResponse = await productsService.createNewProductByMerchantId(
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
      message: "Create New Product Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProductByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.updateProductByMerchantId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "productsService.updateProductByMerchantId - body not provided!",
      });
    }
    const apiResponse = await productsService.updateProductByMerchantId(
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
      message: "Update Product Successfully",
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
  menusByCategory,
  menusByMerchantId,
  detailProductByMerchantId,
  detailProductById,
  listProductByCategoryId,
  createNewProductByMerchantId,
  updateProductByMerchantId,
};
