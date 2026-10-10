import express from "express";
import { Request, Response, NextFunction } from "express";
import regionsService from "../../services/regions";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty } from "../../helpers";

const getProvinces = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiResponse = await regionsService.getProvinces();
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
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProvinceById = async (
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
    const apiResponse = await regionsService.getProvinceById(req.params);
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
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRegenciesByProvinceId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "regionsService.getRegenciesByProvinceId - params not provided!",
      });
    }
    const apiResponse = await regionsService.getRegenciesByProvinceId(
      req.params,
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
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDistrictsByRegencyId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "regionsService.getDistrictsByRegencyId - params not provided!",
      });
    }
    const apiResponse = await regionsService.getDistrictsByRegencyId(
      req.params,
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
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getVillagesByDistrictId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "regionsService.getVillagesByDistrictId - params not provided!",
      });
    }
    const apiResponse = await regionsService.getVillagesByDistrictId(
      req.params,
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
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProvinces,
  getProvinceById,
  getRegenciesByProvinceId,
  getDistrictsByRegencyId,
  getVillagesByDistrictId,
};
