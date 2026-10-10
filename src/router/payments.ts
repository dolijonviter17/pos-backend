import express from "express";
import paymentsController from "../controllers/payments";
export default (router: express.Router) => {
  /**
   * @swagger
   * /payments:
   *   post:
   *     tags:
   *       - Payment Gateway
   *     summary: Create Payment Transaction
   *     description: Membuat transaksi pembayaran berdasarkan order id
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - order_id
   *             properties:
   *               order_id:
   *                 type: integer
   *                 example: 1001
   *     responses:
   *       200:
   *         description: Berhasil membuat transaksi pembayaran
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 transaction_details:
   *                   type: object
   *                   properties:
   *                     order_id:
   *                       type: string
   *                       example: "1001"
   *                     gross_amount:
   *                       type: number
   *                       example: 150000
   *                 customer_details:
   *                   type: object
   *                   properties:
   *                     first_name:
   *                       type: string
   *                       example: John
   *                     last_name:
   *                       type: string
   *                       example: Doe
   *                     email:
   *                       type: string
   *                       example: john@email.com
   *                     phone:
   *                       type: string
   *                       example: "081234567890"
   *                 item_details:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         example: "1"
   *                       name:
   *                         type: string
   *                         example: Nasi Goreng
   *                       price:
   *                         type: number
   *                         example: 25000
   *                       quantity:
   *                         type: integer
   *                         example: 2
   *                 tax:
   *                   type: number
   *                   example: 5000
   *                 admin:
   *                   type: number
   *                   example: 3000
   *                 delivery:
   *                   type: number
   *                   example: 10000
   *                 grand_total:
   *                   type: number
   *                   example: 168000
   *       400:
   *         description: Order tidak ditemukan atau tidak valid
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       500:
   *         description: Internal server error
   */
  router.post("/payments", paymentsController.getPaymentGatewayByCustomerId);
  router.post(
    "/payment/verification",
    paymentsController.getVerificationPaymentByCustomerId,
  );
  router.post(
    "/payment/midtrans-notification",
    paymentsController.getMidTransNotification,
  );
};
