import express from "express";
import productsController from "../controllers/products";
export default (router: express.Router) => {
  router.post("/products", productsController.menusByCategory);
  router.post("/products/byMerchantId", productsController.menusByMerchantId);
  router.post(
    "/product/create",
    productsController.createNewProductByMerchantId,
  );
  router.patch("/product/update", productsController.updateProductByMerchantId);
  router.post(
    "/products/detailProductByMerchantId",
    productsController.detailProductByMerchantId,
  );
  router.get("/product/:product_id", productsController.detailProductById);
  router.get(
    "/product/:merchant_id/:category_id/:offset/:limit",
    productsController.listProductByCategoryId,
  );
};
