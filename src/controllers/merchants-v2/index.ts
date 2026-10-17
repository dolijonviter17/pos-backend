import { Request, Response, NextFunction } from "express";
import merchantsV2Service from "../../services/merchants-v2";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty, verifyToken } from "../../helpers";

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

const getMerchantBranchByMerchantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "merchantsV2Service.getMerchantBranchByMerchantId - params not provided!",
      });
    }
    const apiResponse = await merchantsV2Service.getMerchantBranchByMerchantId(
      req.cookies,
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

const createNewMerchantBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "merchantsV2Service.createNewMerchantBranch - body not provided!",
      });
    }
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    console.log("token", token);

    const userAuth = verifyToken(token);
    console.log("userAuth", userAuth);

    if (!userAuth) {
      return res.status(401).json({ status: 401, message: "token not found" });
    }
    const apiResponse = await merchantsV2Service.createNewMerchantBranch(
      req.body,
      userAuth,
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Register Branch Merchant Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createNewMerchant,
  getMerchantInfo,
  getMerchantBranchByMerchantId,
  createNewMerchantBranch,
};
