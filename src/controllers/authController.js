const jwt = require('jsonwebtoken');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'taklifnoma-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * POST /api/auth/register
 * Body: { phone, name, password }
 */
exports.register = catchAsync(async (req, res) => {
  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    throw AppError.badRequest('Telefon, ism va parol majburiy');
  }

  // Normalize phone
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.length < 9) {
    throw AppError.badRequest('Telefon raqam noto\'g\'ri');
  }

  if (password.length < 4) {
    throw AppError.badRequest('Parol kamida 4 ta belgidan iborat bo\'lishi kerak');
  }

  // Check if phone already exists
  const existing = await User.findOne({ where: { phone: cleanPhone } });
  if (existing) {
    throw AppError.badRequest('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ phone: cleanPhone, name, passwordHash });

  const token = signToken(user.id);
  ApiResponse.success(res, { token, user }, 'Muvaffaqiyatli ro\'yxatdan o\'tildi', 201);
});

/**
 * POST /api/auth/login
 * Body: { phone, password }
 */
exports.login = catchAsync(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw AppError.badRequest('Telefon va parol kiritilishi shart');
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const user = await User.findOne({ where: { phone: cleanPhone } });

  if (!user || !(await user.checkPassword(password))) {
    throw AppError.unauthorized('Telefon yoki parol noto\'g\'ri');
  }

  if (!user.isActive) {
    throw AppError.unauthorized('Akkaunt bloklangan');
  }

  const token = signToken(user.id);
  ApiResponse.success(res, { token, user }, 'Muvaffaqiyatli kirildi');
});

/**
 * GET /api/auth/me
 * Protected — returns current user
 */
exports.me = catchAsync(async (req, res) => {
  ApiResponse.success(res, { user: req.user });
});
