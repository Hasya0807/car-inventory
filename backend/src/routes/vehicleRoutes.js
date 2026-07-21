const express = require('express');
const { 
  createVehicle, 
  getVehicles,
  getVehicle, 
  updateVehicle, 
  deleteVehicle,
  purchaseVehicle,
  restockVehicle 
} = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateRequest');
const { createVehicleSchema, updateVehicleSchema, purchaseSchema, restockSchema } = require('../utils/schemas');

const upload = require('../middleware/upload');

const router = express.Router();

router.route('/search')
  .get(getVehicles);

router.route('/')
  .post(protect, admin, upload.single('image'), validate(createVehicleSchema), createVehicle)
  .get(getVehicles);

router.route('/:id')
  .get(getVehicle)
  .put(protect, admin, upload.single('image'), validate(updateVehicleSchema), updateVehicle)
  .delete(protect, admin, deleteVehicle);

router.post('/:id/purchase', protect, validate(purchaseSchema), purchaseVehicle);
router.post('/:id/restock', protect, admin, validate(restockSchema), restockVehicle);

module.exports = router;
