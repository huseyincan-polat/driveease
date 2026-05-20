const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/branchController');
const { authenticate, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/branches:
 *   get:
 *     summary: List all branches
 *     tags: [Branches]
 *     security: []
 *     responses:
 *       200: { description: Array of branches }
 *   post:
 *     summary: Add a new branch (admin only)
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, city]
 *             properties:
 *               name: { type: string, example: DriveEase Izmir }
 *               city: { type: string, example: Izmir }
 *     responses:
 *       201: { description: Branch created }
 */
router.get('/',  ctrl.getAllBranches);
router.post('/', authenticate, adminOnly, ctrl.addBranch);

module.exports = router;
