import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateRegisterInput, validateLoginInput } from '../utils/validators.js';

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  validateRegisterInput({ name, email, password, confirmPassword });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(400, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash });

  const token = signToken(user._id);
  res.status(201).json({ success: true, data: { token, user: toPublicUser(user) } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  validateLoginInput({ email, password });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Incorrect email or password.');
  }

  const token = signToken(user._id);
  res.json({ success: true, data: { token, user: toPublicUser(user) } });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: toPublicUser(req.user) } });
});
