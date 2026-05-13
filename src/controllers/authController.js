const jwt = require('jsonwebtoken');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'taklifnoma-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';
const VERIFY_BOT_TOKEN = process.env.VERIFY_BOT_TOKEN || '';
const VERIFY_CHAT_ID = process.env.VERIFY_CHAT_ID || '';

// ── In-memory OTP store ──────────────────────────────────
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPToTelegram(phone, code) {
  if (!VERIFY_BOT_TOKEN || !VERIFY_CHAT_ID) {
    console.log(`\n📱 OTP Code for ${phone}: ${code}\n`);
    return true;
  }

  const message = `🔐 Taklifnoma OTP\n\n📱 Telefon: ${phone}\n🔑 Tasdiqlash kodi: *${code}*\n\n⏱ 5 daqiqa ichida kiring.`;
  const url = `https://api.telegram.org/bot${VERIFY_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: VERIFY_CHAT_ID, text: message, parse_mode: 'Markdown' }),
    });
    const data = await res.json();
    return data.ok;
  } catch (err) {
    console.error('Telegram OTP send error:', err.message);
    return false;
  }
}

/**
 * POST /api/auth/register
 */
exports.register = catchAsync(async (req, res) => {
  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    throw AppError.badRequest('Telefon, ism va parol majburiy');
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.length < 9) {
    throw AppError.badRequest('Telefon raqam noto\'g\'ri');
  }

  if (password.length < 4) {
    throw AppError.badRequest('Parol kamida 4 ta belgidan iborat bo\'lishi kerak');
  }

  const existing = await User.findOne({ phone: cleanPhone });
  if (existing) {
    throw AppError.badRequest('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ phone: cleanPhone, name, passwordHash });

  const token = signToken(user._id);
  ApiResponse.success(res, { token, user }, 'Muvaffaqiyatli ro\'yxatdan o\'tildi', 201);
});

/**
 * POST /api/auth/verify
 */
exports.verify = catchAsync(async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    throw AppError.badRequest('Telefon va tasdiqlash kodi kiritilishi shart');
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const otpData = otpStore.get(code);
  if (!otpData) throw AppError.badRequest('Tasdiqlash kodi noto\'g\'ri');

  if (otpData.expiresAt < Date.now()) {
    otpStore.delete(code);
    throw AppError.badRequest('Tasdiqlash kodi muddati tugagan. Qaytadan urinib ko\'ring.');
  }

  if (otpData.phone !== cleanPhone) throw AppError.badRequest('Tasdiqlash kodi noto\'g\'ri');

  const existing = await User.findOne({ phone: cleanPhone });
  if (existing) {
    otpStore.delete(code);
    throw AppError.badRequest('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
  }

  const user = await User.create({
    phone: otpData.phone,
    name: otpData.name,
    passwordHash: otpData.passwordHash,
  });

  otpStore.delete(code);
  const token = signToken(user._id);
  ApiResponse.success(res, { token, user }, 'Muvaffaqiyatli ro\'yxatdan o\'tildi', 201);
});

/**
 * POST /api/auth/login
 */
exports.login = catchAsync(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw AppError.badRequest('Telefon va parol kiritilishi shart');
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const user = await User.findOne({ phone: cleanPhone });

  if (!user || !(await user.checkPassword(password))) {
    throw AppError.unauthorized('Telefon yoki parol noto\'g\'ri');
  }

  if (!user.isActive) {
    throw AppError.unauthorized('Akkaunt bloklangan');
  }

  const token = signToken(user._id);
  ApiResponse.success(res, { token, user }, 'Muvaffaqiyatli kirildi');
});

/**
 * GET /api/auth/me
 */
exports.me = catchAsync(async (req, res) => {
  ApiResponse.success(res, { user: req.user });
});
