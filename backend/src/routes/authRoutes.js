const express = require('express');
const { 
  register, 
  login,
  getUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');
const { validate } = require('../middleware/validateRequest');
const { protect, admin } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../utils/schemas');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
