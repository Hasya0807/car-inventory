const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, avatar } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name, email, password, phone, address, avatar, role: 'user'
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid user data' });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id, name: user.name, email: user.email, role: user.role,
          phone: user.phone, address: user.address, avatar: user.avatar
        },
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. You do not have ${role} privileges.` });
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id, name: user.name, email: user.email, role: user.role,
          phone: user.phone, address: user.address, avatar: user.avatar
        },
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.role = req.body.role || user.role;
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getUsers, updateUserRole, deleteUser };
