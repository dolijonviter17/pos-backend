import { Request, Response, NextFunction } from "express";
import customersService from "../../services/customers";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty } from "../../helpers";
import { schemeValidationRegisterCustomer } from "../../validations";

const registerWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "customersService.registerWithGoogle - body not provided!",
      });
    }
    const { error, value } = schemeValidationRegisterCustomer({ ...req.body });

    if (error) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "customersService.registerWithGoogle - validation provided!",
        error: error,
      });
    }

    const apiResponse = await customersService.registerWithGoogle(value);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Register Customer Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "customersService.loginWithGoogle - body not provided!",
      });
    }
    const apiResponse = await customersService.loginWithGoogle(req.body);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: apiResponse.token
        ? "Login Customer Successfully"
        : "Login Customer Failed",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const profileCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "customersService.profileCustomer - headers not provided!",
      });
    }
    const apiResponse = await customersService.profileCustomer(req.headers);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Profile Customer Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateDataCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "customersService.updateDataCustomerById - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "customersService.updateDataCustomerById - body not provided!",
      });
    }
    const apiResponse = await customersService.updateDataCustomerById(
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
      message: "Update Customer Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (
  req: any,
  res: any,
  next: NextFunction
): Promise<any> => {
  try {
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        status: StatusCodes.PRECONDITION_FAILED,
        message: "body not provided"
      })
    }

    const result = await customersService.updatePassword(req.body, req.headers)
    if (result.executionError) {
      return res.status(result.status).json({
        status: result.status,
        message: result.message
      })
    }

    return res.status(200).json({
      status: 200,
      message: "Update password successfully"
    })


  } catch (error) {
    next(error)
  }
}

export default {
  registerWithGoogle,
  loginWithGoogle,
  profileCustomer,
  updateDataCustomerById,
  updatePassword,
};
