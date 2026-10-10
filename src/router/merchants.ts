import express from "express";
import merchantsController from "../controllers/merchants";
export default (router: express.Router) => {
  /**
   * @swagger
   * /merchant/create:
   *   post:
   *     tags:
   *       - Merchant
   *     summary: Create Merchant
   *     description: Endpoint untuk membuat data merchant baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email_user
   *               - password
   *               - bank_name
   *               - bank_no
   *               - merchant_name
   *               - merchant_email
   *               - address
   *             properties:
   *               email_user:
   *                 type: string
   *                 format: email
   *                 example: user@email.com
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *               bank_name:
   *                 type: string
   *                 example: Bank BCA
   *               bank_no:
   *                 type: string
   *                 example: "1234567890"
   *               merchant_name:
   *                 type: string
   *                 example: Toko Maju Jaya
   *               merchant_email:
   *                 type: string
   *                 format: email
   *                 example: merchant@email.com
   *               address:
   *                 type: string
   *                 example: Jl. Sudirman No. 10, Jakarta
   *     responses:
   *       201:
   *         description: Merchant berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email_user:
   *                   type: string
   *                   example: user@email.com
   *                 password:
   *                   type: string
   *                   example: Password123
   *                 bank_name:
   *                   type: string
   *                   example: Bank BCA
   *                 bank_no:
   *                   type: string
   *                   example: "1234567890"
   *                 merchant_name:
   *                   type: string
   *                   example: Toko Maju Jaya
   *                 merchant_email:
   *                   type: string
   *                   example: merchant@email.com
   *                 address:
   *                   type: string
   *                   example: Jl. Sudirman No. 10, Jakarta
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  router.post("/merchant/create", merchantsController.registerMerchant);

  /**
   * @swagger
   * /merchant/{merchant_id}:
   *   get:
   *     tags:
   *       - Merchant
   *     summary: Get Merchant By ID
   *     description: Mengambil detail merchant berdasarkan merchant_id
   *     parameters:
   *       - in: path
   *         name: merchant_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID dari merchant
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan data merchant
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 email_user:
   *                   type: string
   *                   example: user@email.com
   *                 password:
   *                   type: string
   *                   example: Password123
   *                 bank_name:
   *                   type: string
   *                   example: Bank BCA
   *                 bank_no:
   *                   type: string
   *                   example: "1234567890"
   *                 merchant_name:
   *                   type: string
   *                   example: Toko Maju Jaya
   *                 merchant_email:
   *                   type: string
   *                   example: merchant@email.com
   *                 address:
   *                   type: string
   *                   example: Jl. Sudirman No. 10, Jakarta
   *       404:
   *         description: Merchant tidak ditemukan
   *       500:
   *         description: Internal server error
   */
  router.get(
    "/merchant/:merchant_id",
    merchantsController.getMerchantDetailById,
  );
};
