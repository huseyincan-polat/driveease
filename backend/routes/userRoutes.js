const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/userController');
const { authenticate, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: John Doe }
 *               email:    { type: string, example: john@example.com }
 *               password: { type: string, example: secret123 }
 *               role:     { type: string, enum: [customer, admin], example: customer }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 *
 * /api/users/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: admin@driveease.com }
 *               password: { type: string, example: admin123 }
 *     responses:
 *       200: { description: Login successful, returns token }
 *       401: { description: Invalid credentials }
 *
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of users }
 *       403: { description: Forbidden }
 */
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.get('/',          authenticate, adminOnly, ctrl.getAllUsers);

module.exports = router;
