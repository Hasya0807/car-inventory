const Purchase = require('../models/Purchase');

const getOrders = async (req, res, next) => {
  try {
    const orders = await Purchase.find()
      .populate('userId', 'name email phone')
      .populate('vehicleId', 'make model year imageUrl price')
      .sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders
};
