import express from "express";
import categoriesController from "../controllers/categories";
export default (router: express.Router) => {
  /**
   * @swagger
   * /category/{category_id}:
   *   patch:
   *     summary: Update Category
   *     description: Update category name and regenerate type_of_product automatically.
   *     tags:
   *       - Category
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: category_id
   *         required: true
   *         schema:
   *           type: string
   *         description: Category ID to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               category_name:
   *                 type: string
   *                 example: "Minuman Dingin"
   *     responses:
   *       200:
   *         description: Category updated successfully
   *         content:
   *           application/json:
   *             example:
   *               status: 200
   *               message: success update category
   *               data:
   *                 id: 12
   *                 category_name: "Minuman Dingin"
   *                 type_of_product: "minuman_dingin"
   *                 merchant_id: 3
   *       401:
   *         description: Token not valid
   *         content:
   *           application/json:
   *             example:
   *               status: 401
   *               message: token not valid
   *       404:
   *         description: Category not found or validation error
   *         content:
   *           application/json:
   *             example:
   *               status: 404
   *               message: category was not found
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             example:
   *               status: 500
   *               message: internal server error
   */
  router.patch(
    "/category/:category_id",
    categoriesController.updateCategoryByMerchantId,
  );

  /**
   * @swagger
   * /category/{merchant_id}/{offset}/{limit}:
   *   get:
   *     summary: Get category list by merchant ID with pagination
   *     description: Mengambil daftar kategori berdasarkan merchant ID, dengan dukungan pagination offset & limit.
   *     tags:
   *       - Category
   *
   *     parameters:
   *       - in: path
   *         name: merchant_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID dari merchant
   *         example: 1
   *
   *       - in: path
   *         name: offset
   *         required: false
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Offset data untuk pagination
   *         example: 0
   *
   *       - in: path
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Batas jumlah data yang diambil
   *         example: 10
   *
   *     responses:
   *       200:
   *         description: Berhasil mendapatkan daftar kategori
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 12
   *                   merchant_id:
   *                     type: integer
   *                     example: 1
   *                   category_name:
   *                     type: string
   *                     example: "Food & Drink"
   *                   type_of_product:
   *                     type: string
   *                     example: "food_drink"
   *                   is_active:
   *                     type: boolean
   *                     example: true
   *             example:
   *               - id: 1
   *                 merchant_id: 1
   *                 category_name: "Food"
   *                 type_of_product: "food"
   *                 is_active: true
   *               - id: 2
   *                 merchant_id: 1
   *                 category_name: "Drink"
   *                 type_of_product: "drink"
   *                 is_active: true
   *
   *       404:
   *         description: Merchant tidak ditemukan / kategori kosong / parameter tidak valid
   *         content:
   *           application/json:
   *             examples:
   *               merchant_id_empty:
   *                 value:
   *                   status: 404
   *                   message: "merchant_id is empty"
   *               merchant_not_found:
   *                 value:
   *                   status: 404
   *                   message: "merchant not found"
   *               category_not_found:
   *                 value:
   *                   status: 404
   *                   message: "category not found"
   *
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             example:
   *               status: 500
   *               message: "Error table something went wrong"
   */

  router.get(
    "/listcategoryproduct/:offset/:limit",
    categoriesController.listCategoryByMerchantId,
  );

  /**
   * @swagger
   * /category/create:
   *   post:
   *     summary: Create New Category
   *     description: Create new category and auto-generate type_of_product from category_name.
   *     tags:
   *       - Category
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               category_name:
   *                 type: string
   *                 example: "Makanan Berat"
   *     responses:
   *       200:
   *         description: Category created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example:
   *                 status: 200
   *                 message: "success create category"
   *                 data:
   *                   id: 15
   *                   category_name: "Makanan Berat"
   *                   type_of_product: "makanan_berat"
   *                   merchant_id: 3
   *       401:
   *         description: Token not valid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example:
   *                 status: 401
   *                 message: "token not valid"
   *       404:
   *         description: Validation error or category already exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               examples:
   *                 emptyName:
   *                   value:
   *                     status: 404
   *                     message: "category_name is empty"
   *                 created:
   *                   value:
   *                     status: 404
   *                     message: "category was created"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               example:
   *                 status: 500
   *                 message: Error table internal s server error
   */

  router.post(
    "/category/create",
    categoriesController.createNewCategoryByMerchantId,
  );
};
