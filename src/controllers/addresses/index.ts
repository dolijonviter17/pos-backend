import { Request, Response, NextFunction } from "express";
import addressService from "../../services/addresses";
import { StatusCodes } from "http-status-codes";
import { isBodyEmpty } from "../../helpers";
import { schemeValidationRegisterCustomer } from "../../validations";

const myAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "addressService.myAddress - headers not provided!",
      });
    }
    const apiResponse = await addressService.myAddress(req.headers);
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ status: apiResponse.status, message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Get My Address Successfully",
      response: {
        results: apiResponse,
        total: apiResponse.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAddressDetailsByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.getAddressDetailsByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.getAddressDetailsByCustomerId -  params not provided!",
      });
    }
    const apiResponse = await addressService.getAddressDetailsByCustomerId(
      req.params,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Details My Address Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addAddressByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.addAddressByCustomerId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message: "addressService.addAddressByCustomerId -  body not provided!",
      });
    }
    const apiResponse = await addressService.addAddressByCustomerId(
      req.body,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Add Address Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAddressByCustomerAddressId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.updateAddressByCustomerAddressId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.updateAddressByCustomerAddressId -  params not provided!",
      });
    }
    if (isBodyEmpty(req.body)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.updateAddressByCustomerAddressId -  body not provided!",
      });
    }
    const apiResponse = await addressService.updateAddressByCustomerAddressId(
      req.params,
      req.body,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(200).json({
      status: 200,
      message: "Updated Address Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAddressByCustomerAddressId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isBodyEmpty(req.headers)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.deleteAddressByCustomerAddressId - headers not provided!",
      });
    }
    if (isBodyEmpty(req.params)) {
      return res.status(StatusCodes.PRECONDITION_FAILED).json({
        message:
          "addressService.deleteAddressByCustomerAddressId -  params not provided!",
      });
    }
    const apiResponse = await addressService.deleteAddressByCustomerAddressId(
      req.params,
      req.headers
    );
    if (apiResponse.executionError) {
      return res
        .status(apiResponse.status)
        .json({ message: apiResponse.message });
    }
    return res.status(201).json({
      status: 201,
      message: "Deleted Address Successfully",
      response: {
        results: apiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  myAddress,
  getAddressDetailsByCustomerId,
  addAddressByCustomerId,
  updateAddressByCustomerAddressId,
  deleteAddressByCustomerAddressId,
};
