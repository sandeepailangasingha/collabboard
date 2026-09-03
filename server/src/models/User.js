import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      default: 'Team Member',
      trim: true,
    },
    avatarColor: {
      type: String,
      default: '#6366f1',
    },
  },
  { timestamps: true }
);

// Generate JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Safe user object (no password)
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatarColor: this.avatarColor,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
