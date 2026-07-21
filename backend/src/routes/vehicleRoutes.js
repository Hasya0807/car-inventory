const express = require('express');
const { createVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/search')
  .get(protect, getVehicles);

router.route('/')
  .post(protect, admin, createVehicle)
  .get(protect, getVehicles);

router.route('/:id')
  .put(protect, admin, updateVehicle)
  .delete(protect, admin, deleteVehicle);

module.exports = router;
