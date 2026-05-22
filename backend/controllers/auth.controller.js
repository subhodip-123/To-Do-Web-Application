const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user.id),
  });
});

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user.id),
  });
});

// @desc   Get current user profile
// @route  GET /api/auth/profile
// @access Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.avatar) updates.avatar = req.body.avatar;
  if (req.body.password) updates.password = req.body.password;

  await user.update(updates);

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user.id),
  });
});
