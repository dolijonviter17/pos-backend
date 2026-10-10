import express from "express";
import authentication from "./authentication";
import products from "./products";
import orders from "./orders";
import merchants from "./merchants";
import customers from "./customers";
import addresses from "./addresses";
import payments from "./payments";
import uploads from "./uploads";
import users from "./users";
import categories from "./categories";

const router = express.Router();
export default (): express.Router => {
  // users(router);
  // userpg(router);
  customers(router);
  merchants(router);
  orders(router);
  products(router);
  authentication(router);
  addresses(router);
  payments(router);
  uploads(router);
  users(router); // done documentasi
  categories(router); // done documentasi
  return router;
};
