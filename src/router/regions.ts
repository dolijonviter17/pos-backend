import express from "express";
import regionsController from "../controllers/regions";
export default (router: express.Router) => {
  router.get("/region/provinces", regionsController.getProvinces);
  router.get(
    "/region/province/:province_id",
    regionsController.getProvinceById,
  );
};
