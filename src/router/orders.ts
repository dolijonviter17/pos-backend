import express from "express";
import ordersController from "../controllers/orders";
export default (router: express.Router) => {
  /**
   * @swagger
   * /orders/byMerchantId:
   *   post:
   *     tags:
   *       - Orders
   *     summary: Create Order By Merchant ID
   *     description: Membuat order berdasarkan merchant_id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - products
   *               - merchant_id
   *               - customer_name
   *               - customer_no
   *               - table_no
   *             properties:
   *               products:
   *                 type: array
   *                 description: List produk yang dipesan
   *                 items:
   *                   type: object
   *                   properties:
   *                     product_id:
   *                       type: integer
   *                       example: 1
   *                     product_name:
   *                       type: string
   *                       example: Nasi Goreng
   *                     quantity:
   *                       type: integer
   *                       example: 2
   *                     price:
   *                       type: number
   *                       format: float
   *                       example: 25000
   *               merchant_id:
   *                 type: integer
   *                 example: 10
   *               customer_name:
   *                 type: string
   *                 example: Budi
   *               customer_no:
   *                 type: string
   *                 example: "081234567890"
   *               table_no:
   *                 type: string
   *                 example: "A1"
   *     responses:
   *       201:
   *         description: Order berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                 merchant_id:
   *                   type: integer
   *                   example: 10
   *                 customer_name:
   *                   type: string
   *                   example: Budi
   *                 customer_no:
   *                   type: string
   *                   example: "081234567890"
   *                 table_no:
   *                   type: string
   *                   example: "A1"
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  router.post("/orders/byMerchantId", ordersController.orderMenus);
  /**
   * @swagger
   * /orders/create:
   *   post:
   *     tags:
   *       - Orders
   *     summary: Create Order
   *     description: Membuat order baru (memerlukan Authorization Bearer Token)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *         description: Bearer token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - products
   *               - merchant_id
   *               - table_no
   *               - order_type
   *             properties:
   *               products:
   *                 type: array
   *                 description: List produk yang dipesan
   *                 items:
   *                   type: object
   *                   required:
   *                     - product_id
   *                     - quantity
   *                   properties:
   *                     product_id:
   *                       type: integer
   *                       example: 1
   *                     quantity:
   *                       type: integer
   *                       example: 2
   *                     notes:
   *                       type: string
   *                       example: Tidak pedas
   *               merchant_id:
   *                 type: integer
   *                 example: 10
   *               table_no:
   *                 type: string
   *                 example: "A1"
   *               order_type:
   *                 type: string
   *                 description: Tipe order (dine_in / take_away)
   *                 example: dine_in
   *               notes:
   *                 type: string
   *                 example: Tambah sambal terpisah
   *     responses:
   *       201:
   *         description: Order berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                 merchant_id:
   *                   type: integer
   *                   example: 10
   *                 table_no:
   *                   type: string
   *                   example: "A1"
   *                 order_type:
   *                   type: string
   *                   example: dine_in
   *                 notes:
   *                   type: string
   *                   example: Tambah sambal terpisah
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  router.post("/orders/create", ordersController.createOrderByMerchantId);

  /**
   * @swagger
   * /order/{status}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get Orders By Status
   *     description: Mengambil daftar order berdasarkan status (waiting atau paid)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *         description: Bearer token
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [waiting, paid]
   *         description: Status order (waiting atau paid)
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan data order berdasarkan status
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   products:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         product_id:
   *                           type: integer
   *                           example: 1
   *                         quantity:
   *                           type: integer
   *                           example: 2
   *                   merchant_id:
   *                     type: integer
   *                     example: 10
   *                   table_no:
   *                     type: string
   *                     example: "A1"
   *                   order_type:
   *                     type: string
   *                     example: dine_in
   *                   notes:
   *                     type: string
   *                     example: Tambah sambal terpisah
   *                   status:
   *                     type: string
   *                     example: waiting
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       400:
   *         description: Status tidak valid
   *       500:
   *         description: Internal server error
   */
  router.get("/order/:status", ordersController.getOrdersByCustomerId);
  /**
   * @swagger
   * /order/details/{order_id}:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get Order Details
   *     description: Mengambil detail order berdasarkan order_id
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *         description: Bearer token
   *       - in: path
   *         name: order_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID dari order
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan detail order
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       product_id:
   *                         type: integer
   *                         example: 1
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                 merchant_id:
   *                   type: integer
   *                   example: 10
   *                 table_no:
   *                   type: string
   *                   example: "A1"
   *                 order_type:
   *                   type: string
   *                   example: dine_in
   *                 notes:
   *                   type: string
   *                   example: Tambah sambal terpisah
   *                 status:
   *                   type: string
   *                   example: waiting
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       404:
   *         description: Order tidak ditemukan
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/order/details/:order_id",
    ordersController.getOrdersDetailsByCustomerId,
  );

  /**
   * @swagger
   * /order-status:
   *   get:
   *     tags:
   *       - Orders
   *     summary: Get Order Status
   *     description: >
   *       Mengambil status order berdasarkan salah satu query parameter:
   *       order_id, status_code, transaction_id, atau transaction_status.
   *       Minimal salah satu parameter harus dikirim.
   *     parameters:
   *       - in: query
   *         name: order_id
   *         schema:
   *           type: integer
   *         description: ID order
   *       - in: query
   *         name: status_code
   *         schema:
   *           type: string
   *         description: Kode status transaksi
   *       - in: query
   *         name: transaction_id
   *         schema:
   *           type: string
   *         description: ID transaksi
   *       - in: query
   *         name: transaction_status
   *         schema:
   *           type: string
   *           enum: [pending, settlement, cancel, expire, failure]
   *         description: Status transaksi
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan status order
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 products:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       product_id:
   *                         type: integer
   *                         example: 1
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                 merchant_id:
   *                   type: integer
   *                   example: 10
   *                 table_no:
   *                   type: string
   *                   example: "A1"
   *                 order_type:
   *                   type: string
   *                   example: dine_in
   *                 notes:
   *                   type: string
   *                   example: Tambah sambal terpisah
   *                 status:
   *                   type: string
   *                   example: paid
   *       400:
   *         description: Minimal satu query parameter harus diisi
   *       404:
   *         description: Order tidak ditemukan
   *       500:
   *         description: Internal server error
   */
  router.get("/order-status", ordersController.getOrderStatusByTransaction);
};
