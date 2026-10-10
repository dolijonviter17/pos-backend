import express from "express";
import authController from "../controllers/auth";
export default (router: express.Router) => {
  /**
   * @swagger
   * /register/customers:
   *   post:
   *     tags:
   *       - Customers Authentication
   *     summary: Register Customer
   *     description: Endpoint untuk registrasi customer baru
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - fullname
   *               - email
   *               - phone_number
   *               - password
   *               - password_confirm
   *             properties:
   *               fullname:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@email.com
   *               phone_number:
   *                 type: string
   *                 example: "081234567890"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *               password_confirm:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *               photo:
   *                 type: string
   *                 format: binary
   *                 description: Upload foto customer
   *     responses:
   *       201:
   *         description: Customer berhasil didaftarkan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Customer registered successfully
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  router.post("/register/customers", authController.registerAccount);
  /**
   * @swagger
   * /login/customers:
   *   post:
   *     tags:
   *       - Customers Authentication
   *     summary: Login Customer
   *     description: Endpoint untuk login customer menggunakan email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@email.com
   *     responses:
   *       200:
   *         description: Login berhasil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   description: Data user yang berhasil login
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     fullname:
   *                       type: string
   *                       example: John Doe
   *                     email:
   *                       type: string
   *                       example: johndoe@email.com
   *                     phone_number:
   *                       type: string
   *                       example: "081234567890"
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       400:
   *         description: Email tidak ditemukan atau tidak valid
   *       500:
   *         description: Internal server error
   */
  router.post("/login/customers", authController.loginUser);

  /**
   * @swagger
   * /auth/getUserInfo:
   *   post:
   *     tags:
   *       - Customers Authentication
   *     summary: Get User Info
   *     description: Mengambil informasi user berdasarkan email dengan Authorization Bearer Token
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *         description: token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: johndoe@email.com
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan data user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     fullname:
   *                       type: string
   *                       example: John Doe
   *                     email:
   *                       type: string
   *                       example: johndoe@email.com
   *                     phone_number:
   *                       type: string
   *                       example: "081234567890"
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       404:
   *         description: User tidak ditemukan
   *       500:
   *         description: Internal server error
   */
  router.post("/auth/getUserInfo", authController.getUserInfo);

  /**
   * @swagger
   * /auth/register/merchant:
   *   post:
   *     tags:
   *       - Customers Authentication
   *     summary: Register Merchant
   *     description: Endpoint untuk registrasi merchant baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - first_name
   *               - last_name
   *               - email
   *               - number_phone
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: merchant123
   *               first_name:
   *                 type: string
   *                 example: John
   *               last_name:
   *                 type: string
   *                 example: Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: merchant@email.com
   *               number_phone:
   *                 type: string
   *                 example: "081234567890"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: Password123
   *     responses:
   *       201:
   *         description: Merchant berhasil didaftarkan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username:
   *                   type: string
   *                   example: merchant123
   *                 first_name:
   *                   type: string
   *                   example: John
   *                 last_name:
   *                   type: string
   *                   example: Doe
   *                 email:
   *                   type: string
   *                   example: merchant@email.com
   *                 number_phone:
   *                   type: string
   *                   example: "081234567890"
   *                 password:
   *                   type: string
   *                   example: Password123
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  router.post("/auth/register/merchant", authController.registerMerchant);
  // router.get("/test", authController.testLogin);
  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     tags:
   *       - Customers Authentication
   *     summary: Logout Customer
   *     description: Endpoint untuk logout customer dengan Bearer Token
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         schema:
   *           type: string
   *         description: Bearer token
   *     responses:
   *       200:
   *         description: Logout berhasil
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: logout berhasil
   *       401:
   *         description: Unauthorized - Token tidak valid atau tidak ada
   *       500:
   *         description: Internal server error
   */
  router.post("/auth/logout", authController.logoutUser);
};
