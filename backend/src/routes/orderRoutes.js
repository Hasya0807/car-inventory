const express = require('express');
const { getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, admin, getOrders);

module.exports = router;
