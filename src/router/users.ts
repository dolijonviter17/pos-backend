import express from "express";
import usersController from "../controllers/users";
export default (router: express.Router) => {
  /**
   * @swagger
   * /user/create:
   *   post:
   *     summary: Register user baru
   *     description: |
   *       API untuk membuat user baru.
   *       Validasi dilakukan untuk memastikan:
   *       - email tidak boleh kosong
   *       - password tidak boleh kosong
   *       - role tidak boleh kosong
   *       - merchant_id tidak boleh kosong
   *       - email belum pernah digunakan
   *       - role harus salah satu dari: Admin, Owner, Superadmin
   *       - merchant_id harus valid
   *
   *     tags:
   *       - Auth
   *
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - role
   *               - merchant_id
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: newuser@example.com
   *               password:
   *                 type: string
   *                 example: "123456"
   *               role:
   *                 type: string
   *                 enum: [Admin, Owner, Superadmin]
   *                 example: Admin
   *               merchant_id:
   *                 type: integer
   *                 example: 10
   *
   *     responses:
   *       201:
   *         description: User berhasil dibuat
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 email:
   *                   type: string
   *                   example: newuser@example.com
   *                 merchant_id:
   *                   type: integer
   *                   example: 10
   *                 role:
   *                   type: string
   *                   example: Admin
   *
   *       400:
   *         description: Validasi gagal atau email sudah digunakan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: email has been using, please login first
   *
   *       404:
   *         description: Merchant tidak ditemukan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: merchant not found
   *
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: internal server error
   */

  router.post("/user/create", usersController.registerNewUser);

  /**
   * @swagger
   * /user/login:
   *   post:
   *     summary: Login user
   *     description: |
   *       Login user dengan email & password.
   *       API ini akan:
   *       - Validasi input email & password
   *       - Cek apakah user aktif
   *       - Verifikasi password menggunakan salt + hashing
   *       - Mengembalikan JWT token jika berhasil
   *
   *     tags:
   *       - Auth
   *
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 example: "123456"
   *
   *     responses:
   *       200:
   *         description: Login berhasil. JWT token diberikan.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token untuk autentikasi
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *
   *       400:
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: Password is wrong
   *
   *       404:
   *         description: User tidak ditemukan
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: number
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: user not found
   */
  router.post("/user/login", usersController.loginUser);
};
