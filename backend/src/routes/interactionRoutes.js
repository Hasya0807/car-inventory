const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Wishlist = require('../models/Wishlist');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Toggle Wishlist
router.post('/vehicles/:id/wishlist', protect, async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user._id;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const existing = await Wishlist.findOne({ userId, vehicleId });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, message: 'Removed from wishlist', action: 'removed' });
    } else {
      await Wishlist.create({ userId, vehicleId });
      return res.status(200).json({ success: true, message: 'Added to wishlist', action: 'added' });
    }
  } catch (error) {
    next(error);
  }
});

// Get User Wishlist
router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).populate('vehicleId');
    const vehicles = items.map(item => item.vehicleId);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
