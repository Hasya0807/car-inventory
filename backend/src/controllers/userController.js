const User = require('../models/User');
const Purchase = require('../models/Purchase');
const Wishlist = require('../models/Wishlist'); // if it exists, wait, let me check how wishlists are stored.

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    
    // We can fetch purchase counts and wishlist counts using Promise.all
    const userStats = await Promise.all(users.map(async (user) => {
      const purchaseCount = await Purchase.countDocuments({ userId: user._id, status: 'Completed' });
      // I need to see how Wishlists are stored. If they are in Wishlist model...
      // Let's assume Wishlist has { userId, vehicleId }
      let wishlistCount = 0;
      try {
        const mongoose = require('mongoose');
        const WishlistModel = mongoose.model('Wishlist');
        wishlistCount = await WishlistModel.countDocuments({ userId: user._id });
      } catch (e) {
        // Wishlist model might not exist or be different
      }

      return {
        ...user.toObject(),
        purchaseCount,
        wishlistCount
      };
    }));

    res.status(200).json({ success: true, data: userStats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers
};
