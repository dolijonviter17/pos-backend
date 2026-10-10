import express from "express";
import { Request, Response, NextFunction } from "express";
import authService from "../../services/auth";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";
import merchantAuthService from "../../services/merchants-auth";

const getToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    var seckret = seckretPrivate();
    let token = jwt.sign({ user: "JONVITER-REST-API" }, seckret);
    return res.status(200).json({ message: "success", token: token });
  } catch (error) {
    next(error);
  }
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.userInformation - headers not provided!",
      });
    }
    const apiResponse = await authService.userInformation(req.headers);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

const registerAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   return res.status(StatusCodes.EXPECTATION_FAILED).json({
    //     message: "token not valid",
    //   });
    // }

    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.createNewUser - body not provided!",
      });
    }
    const apiResponse = await authService.createNewUser(req.body);
    if (apiResponse.executionError) {
      return res.status(apiResponse.status).json({
        status: apiResponse.status,
        message: apiResponse.message,
      });
    }
    return res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.loginUser - body not provided!",
      });
    }
    const apiResponse = await authService.loginUser(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Login User Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const registerMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.createNewMerchant - body not provided!",
      });
    }
    const apiResponse = await authService.createNewMerchant(req.body);
    if (apiResponse.executionError) {
      return res.status(apiResponse.status).json({
        status: apiResponse.status,
        message: apiResponse.message,
      });
    }
    return res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

const testLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let test_user = await pool.query("select * from users limit 1");
    return res.status(200).json({ response: test_user.rows[0] });
  } catch (error) {
    res.status(404).json({ message: "error guys" });
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.logoutUser - body not provided!",
      });
    }
    const apiResponse = await authService.logoutUser(req.headers);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.json({ message: "logout berhasil" });
  } catch (error) {
    next(error);
  }
};

const loginMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "authService.loginUser - body not provided!",
      });
    }
    const apiResponse = await merchantAuthService.loginMerchant(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Login User Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserMerchantBranch = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "merchantAuthService.getUserMerchantBranch - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "merchantAuthService.getOrdersByCustomerId -  body not provided!",
      });
    }
    const apiResponse = await merchantAuthService.getUserMerchantBranch(
      req.headers,
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
export default {
  registerAccount,
  loginUser,
  getToken,
  getUserInfo,
  registerMerchant,
  testLogin,
  logoutUser,
  loginMerchant,
  getUserMerchantBranch,
};
