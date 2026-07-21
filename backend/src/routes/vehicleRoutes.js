const express = require('express');
const { 
  createVehicle, 
  getVehicles, 
  updateVehicle, 
  deleteVehicle,
  purchaseVehicle,
  restockVehicle 
} = require('../controllers/vehicleController');
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

router.post('/:id/purchase', protect, purchaseVehicle);
router.post('/:id/restock', protect, admin, restockVehicle);

module.exports = router;
