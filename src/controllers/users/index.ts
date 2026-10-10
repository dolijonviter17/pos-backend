import express from "express";
import { Request, Response, NextFunction } from "express";
import usersService from "../../services/users";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../error/apiError";
import { isBodyEmpty } from "../../helpers";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { seckretPrivate } from "../../helpers";
import { pool } from "../../database/pool";

const registerNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "usersService.registerNewUser - body not provided!",
      });
    }
    const apiResponse = await usersService.registerNewUser(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Register new user Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "usersService.loginUser - body not provided!",
      });
    }
    const apiResponse = await usersService.loginUser(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Login User Successfully",
      method: "POST",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const swaggerTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ token: "example-token" });
  } catch (error) {
    next(error);
  }
};

export default { registerNewUser, loginUser, swaggerTest };
