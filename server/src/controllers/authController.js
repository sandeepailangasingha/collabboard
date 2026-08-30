import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { UserModel } from '../models/userModel.js';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  const existingUser = UserModel.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  const newUser = UserModel.create({ name, email, password, role });
  const token = generateToken(newUser.id);

  return res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatarColor: newUser.avatarColor,
    },
    token,
  });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = UserModel.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user.id);

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor,
    },
    token,
  });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarColor: req.user.avatarColor,
    },
  });
};
