import express from "express";
import merchantAuthController from "../controllers/merchant-auth";

export default (router: express.Router) => {
  //   router.post("/register/customers", authController.registerAccount);

  //   router.post("/login/customers", authController.loginUser);

  //   router.post("/auth/getUserInfo", authController.getUserInfo);

  //   router.post("/auth/register/merchant", authController.registerMerchant);

  //   router.post("/auth/logout", authController.logoutUser);
  router.post("/merchantauth/login", merchantAuthController.loginMerchant);
  router.get(
    "/usermerchantbranch",
    merchantAuthController.getUserMerchantBranch,
  );
};
