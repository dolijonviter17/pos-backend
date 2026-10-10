import express from "express";
import regionsController from "../controllers/regions";
export default (router: express.Router) => {
  router.get("/region/provinces", regionsController.getProvinces);
  router.get(
    "/region/province/:province_id",
    regionsController.getProvinceById,
  );
  router.get(
    "/region/regency/:province_id",
    regionsController.getRegenciesByProvinceId,
  );
  router.get(
    "/region/district/:regency_id",
    regionsController.getDistrictsByRegencyId,
  );
  router.get(
    "/region/village/:regency_id",
    regionsController.getVillagesByDistrictId,
  );
};
