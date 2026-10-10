import express from "express";
import uploadsController from "../controllers/uploads";
import upload from "../config/multer";

export default (router: express.Router) => {
  router.post(
    "/upload/product",
    upload.single("image"),
    uploadsController.uploadsProductByMerchantId
  );
};
