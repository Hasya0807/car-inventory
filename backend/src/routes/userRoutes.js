const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, admin, getUsers);

module.exports = router;
