const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carController');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.getAllCars);
router.post('/', authenticate, adminOnly, ctrl.createCar);
router.get('/:id', ctrl.getCarById);
router.put('/:id', authenticate, adminOnly, ctrl.updateCar);
router.delete('/:id', authenticate, adminOnly, ctrl.deleteCar);

module.exports = router;