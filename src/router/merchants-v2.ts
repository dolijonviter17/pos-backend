import express from "express";
import merchantsController from "../controllers/merchants-v2";
export default (router: express.Router) => {
  router.post("/merchant/create", merchantsController.createNewMerchant);
  router.get("/merchant/:merchant_id", merchantsController.getMerchantInfo);
};
