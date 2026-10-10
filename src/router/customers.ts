import express from "express";
import customersController from "../controllers/customers";
export default (router: express.Router) => {
  router.post("/customers/login", customersController.loginWithGoogle);
  router.post("/customers/register", customersController.registerWithGoogle);
  router.get("/customer/me", customersController.profileCustomer);
  router.patch("/customer", customersController.updateDataCustomerById);
  router.post("/customer/reset-password", customersController.updatePassword)
};
