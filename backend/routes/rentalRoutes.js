const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/rentalController');
const { authenticate, adminOnly } = require('../middleware/auth');

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: List rentals (admin = all, customer = own)
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of rentals }
 *   post:
 *     summary: Create a new rental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [car_id,pickup_branch_id,return_branch_id,start_date,end_date]
 *             properties:
 *               car_id:           { type: integer, example: 1 }
 *               pickup_branch_id: { type: integer, example: 1 }
 *               return_branch_id: { type: integer, example: 2 }
 *               start_date:       { type: string,  example: "2026-06-01" }
 *               end_date:         { type: string,  example: "2026-06-05" }
 *     responses:
 *       201: { description: Rental created }
 *       400: { description: Validation error }
 *
 * /api/rentals/{id}:
 *   get:
 *     summary: Get rental by ID
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Rental details }
 *       404: { description: Not found }
 *
 * /api/rentals/{id}/complete:
 *   patch:
 *     summary: Mark rental as completed and move car to return branch (admin only)
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Rental completed }
 *
 * /api/rentals/{id}/cancel:
 *   patch:
 *     summary: Cancel a rental
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Rental cancelled }
 */
router.get('/',               authenticate, ctrl.getAllRentals);
router.post('/',              authenticate, ctrl.createRental);
router.get('/:id',            authenticate, ctrl.getRentalById);
router.patch('/:id/complete', authenticate, adminOnly, ctrl.completeRental);
router.patch('/:id/cancel',   authenticate, ctrl.cancelRental);

module.exports = router;
