const jwt = require('jsonwebtoken');
const { User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'taklifnoma-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';
const VERIFY_BOT_TOKEN = process.env.VERIFY_BOT_TOKEN || '';
const VERIFY_CHAT_ID = process.env.VERIFY_CHAT_ID || '';

// ── In-memory OTP store (code → { phone, name, passwordHash, expiresAt }) ──
const otpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Send OTP code to Telegram bot
 */
async function sendOTPToTelegram(phone, code) {
  if (!VERIFY_BOT_TOKEN || !VERIFY_CHAT_ID) {
    console.log(`\n📱 OTP Code for ${phone}: ${code}\n`);
    return true; // Fallback: log to console
  }

  const message = `🔐 Taklifnoma OTP\n\n📱 Telefon: ${phone}\n🔑 Tasdiqlash kodi: *${code}*\n\n⏱ 5 daqiqa ichida kiring.`;
  const url = `https://api.telegram.org/bot${VERIFY_BOT_TOKEN}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: VERIFY_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
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
 * Step 1: Validate, generate OTP, send to Telegram
 * Body: { phone, name, password }
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

  // Check if phone already exists
  const existing = await User.findOne({ where: { phone: cleanPhone } });
  if (existing) {
    throw AppError.badRequest('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
  }

  // Generate OTP
  const code = generateOTP();
  const passwordHash = await User.hashPassword(password);

  // Store OTP data
  otpStore.set(code, {
    phone: cleanPhone,
    name,
    passwordHash,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  // Clean up expired codes
  for (const [key, val] of otpStore) {
    if (val.expiresAt < Date.now()) otpStore.delete(key);
  }

  // Send OTP to Telegram
  const sent = await sendOTPToTelegram(cleanPhone, code);
  if (!sent) {
    console.warn('OTP Telegram send failed, code still valid in memory');
  }

  ApiResponse.success(res, { phone: cleanPhone }, 'Tasdiqlash kodi yuborildi');
});

/**
 * POST /api/auth/verify
 * Step 2: Verify OTP code and create user
 * Body: { phone, code }
 */
exports.verify = catchAsync(async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    throw AppError.badRequest('Telefon va tasdiqlash kodi kiritilishi shart');
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Find OTP data
  const otpData = otpStore.get(code);
  if (!otpData) {
    throw AppError.badRequest('Tasdiqlash kodi noto\'g\'ri');
  }

  // Check expiry
  if (otpData.expiresAt < Date.now()) {
    otpStore.delete(code);
    throw AppError.badRequest('Tasdiqlash kodi muddati tugagan. Qaytadan urinib ko\'ring.');
  }

  // Check phone match
  if (otpData.phone !== cleanPhone) {
    throw AppError.badRequest('Tasdiqlash kodi noto\'g\'ri');
  }

  // Double check phone isn't taken
  const existing = await User.findOne({ where: { phone: cleanPhone } });
  if (existing) {
    otpStore.delete(code);
    throw AppError.badRequest('Bu telefon raqam allaqachon ro\'yxatdan o\'tgan');
  }

  // Create user
  const user = await User.create({
    phone: otpData.phone,
    name: otpData.name,
    passwordHash: otpData.passwordHash,
  });

  // Clean up OTP
  otpStore.delete(code);

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
