const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/categoryController');
const { authenticate, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200: { description: Array of categories }
 *   post:
 *     summary: Add a new category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_name]
 *             properties:
 *               category_name: { type: string, example: Convertible }
 *     responses:
 *       201: { description: Category created }
 */
router.get('/',  ctrl.getAllCategories);
router.post('/', authenticate, adminOnly, ctrl.addCategory);

module.exports = router;
