const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'taklifnoma-secret-key-2026';

/**
 * Middleware: protect route — requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw AppError.unauthorized('Tizimga kiring');
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Foydalanuvchi topilmadi');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Token yaroqsiz yoki muddati o\'tgan'));
    }
    next(error);
  }
};

/**
 * Middleware: optionalAuth — attaches user if token exists, but doesn't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (e) {
    // Silently ignore — optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };
