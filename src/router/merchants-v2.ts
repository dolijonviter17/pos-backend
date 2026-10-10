import express from "express";
import merchantsController from "../controllers/merchants-v2";
export default (router: express.Router) => {
  router.post("/merchantV2/create", merchantsController.createNewMerchant);
  router.post(
    "/merchantV2/branch/create",
    merchantsController.createNewMerchantBranch,
  );
  router.get(
    "/merchantV2ById/:merchant_id",
    merchantsController.getMerchantInfo,
  );
  router.get(
    "/merchantbranch",
    merchantsController.getMerchantBranchByMerchantId,
  );
};
