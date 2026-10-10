import express from "express";
import addressController from "../controllers/addresses";
export default (router: express.Router) => {
  router.get("/addresses/me", addressController.myAddress);
  router.get(
    "/addresses/:address_id",
    addressController.getAddressDetailsByCustomerId
  );
  router.post("/address/add", addressController.addAddressByCustomerId);
  router.put(
    "/address/update/:address_id",
    addressController.updateAddressByCustomerAddressId
  );
  router.delete(
    "/address/delete/:address_id",
    addressController.deleteAddressByCustomerAddressId
  );
};
