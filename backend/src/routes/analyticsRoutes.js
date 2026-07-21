const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Vehicle = require('../models/Vehicle');
const Purchase = require('../models/Purchase');

const router = express.Router();

router.get('/dashboard', protect, admin, async (req, res, next) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    
    const stockStats = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);
    
    const outOfStock = await Vehicle.countDocuments({ quantity: { $lte: 0 } });
    
    const totalPurchases = await Purchase.countDocuments();
    
    const purchaseStats = await Purchase.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysPurchases = await Purchase.countDocuments({
      purchaseDate: { $gte: today }
    });

    res.status(200).json({
      success: true,
      data: {
        totalVehicles,
        vehiclesInStock: stockStats[0]?.totalStock || 0,
        outOfStock,
        totalPurchases,
        revenue: purchaseStats[0]?.revenue || 0,
        todaysPurchases
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
