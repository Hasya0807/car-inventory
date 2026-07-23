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
    const vehicles = items.map(item => item.vehicleId).filter(Boolean);
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    next(error);
  }
});

// Get User Purchases
router.get('/purchases/me', protect, async (req, res, next) => {
  try {
    // Import Purchase inside if it wasn't at top, or just use the mongoose model.
    // Actually we need to require it at the top, but we can do it here:
    const Purchase = require('../models/Purchase');
    const purchases = await Purchase.find({ userId: req.user._id })
      .populate('vehicleId')
      .sort({ purchaseDate: -1 });
    
    // Filter out purchases where the vehicle was deleted
    const validPurchases = purchases.filter(p => p.vehicleId);
    
    res.status(200).json({ success: true, data: validPurchases });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
