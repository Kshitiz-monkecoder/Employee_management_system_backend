const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password.', 400);
    }

    const user = await authRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials or account deactivated.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials.', 401);
    }

    await authRepository.updateLastLogin(user._id);

    const token = signToken(user._id);
    return { token, user };
  }

  async register(data) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already registered.', 409);
    }

    const user = await authRepository.create(data);
    const token = signToken(user._id);
    return { token, user };
  }

  async getMe(userId) {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError('User not found.', 404);
    return user;
  }
}

module.exports = new AuthService();
