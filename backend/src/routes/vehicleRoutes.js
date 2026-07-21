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
const { validate } = require('../middleware/validateRequest');
const { createVehicleSchema, updateVehicleSchema, purchaseSchema, restockSchema } = require('../utils/schemas');

const router = express.Router();

router.route('/search')
  .get(protect, getVehicles);

router.route('/')
  .post(protect, admin, validate(createVehicleSchema), createVehicle)
  .get(protect, getVehicles);

router.route('/:id')
  .put(protect, admin, validate(updateVehicleSchema), updateVehicle)
  .delete(protect, admin, deleteVehicle);

router.post('/:id/purchase', protect, validate(purchaseSchema), purchaseVehicle);
router.post('/:id/restock', protect, admin, validate(restockSchema), restockVehicle);

module.exports = router;
