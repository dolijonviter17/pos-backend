import {
  authentication,
  random,
  numberPonselFormat,
  isNumberPonsel,
  randomBytes,
  getDateTime,
  getDateMaximum,
  seckretPrivate,
  mergeStringWithCharacter,
  bcryptCsfPassword,
  generateKodeOrder,
  getUserIdFromToken,
  capitalizeFirstLetter,
  randomBytesPayment,
} from "../../helpers";
import { pool } from "../../database/pool";
import dotenv from "dotenv";
import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import fs from "fs";

dotenv.config(); // Load environment

import { executionError } from "../responseHandling";

import midtransClient = require("midtrans-client");
import cloudinary from "../../config/cloudinary";
import multer = require("multer");
import path = require("path");

const uploadsProductByMerchantId = async (
  requestFile: any,
  requestHeaders: any
): Promise<any> => {
  try {
    const { file, path } = requestFile;
    if (!requestFile) {
      return executionError(401, "File not found");
    }

    const authHeader = requestHeaders.authorization;
    if (!authHeader) {
      return executionError(404, "token not found");
    }
    const sendToCloudinary: UploadApiResponse =
      await cloudinary.uploader.upload(requestFile.path, {
        folder: "uploads",
      });
    fs.unlinkSync(requestFile.path);

    // if (!order_id) {
    //   return executionError(401, "Errors Your not Eligible");
    // }

    // const userLogin = getUserIdFromToken(authHeader);
    // if (!userLogin) {
    //   return executionError(401, "token not valid");
    // }
    // let customer_data = await pool.query(
    //   "SELECT * FROM m_customers WHERE id = $1",
    //   [userLogin.id]
    // );
    // if (customer_data.rows.length === 0) {
    //   return executionError(404, "customer not found");
    // }
    const { secure_url, public_id } = sendToCloudinary;

    return {
      url: secure_url, // ✅ use this in frontend <img> or CSS
      public_id: public_id, // ✅ store this if you want to delete later
    };
  } catch (error) {
    return executionError(404, `Error table: ${error}`);
  }
};

export default {
  uploadsProductByMerchantId,
};
