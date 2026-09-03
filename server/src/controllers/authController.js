import User from '../models/User.js';

// @desc  Register a new user
// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const avatarColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#3b82f6', '#8b5cf6'];
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Team Member',
      avatarColor: color,
    });

    const token = user.generateToken();
    res.status(201).json({ success: true, user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = user.generateToken();
    res.json({ success: true, user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get current logged in user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: user.toSafeObject() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
