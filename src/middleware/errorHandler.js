const AppError = require('../utils/AppError');

/**
 * Global error-handling middleware.
 * Handles AppError, Mongoose errors, JWT errors, and unknown errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // ── Mongoose Validation Error ────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fieldMessages = Object.values(err.errors || {}).map(e => e.message);
    message = fieldMessages.length > 0 ? fieldMessages.join('. ') : 'Validation error';
    details = Object.entries(err.errors || {}).map(([field, e]) => ({
      field,
      message: e.message,
      value: e.value,
    }));
  }

  // ── Mongoose Duplicate Key Error ─────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    message = `"${value}" allaqachon mavjud (${field})`;
    details = err.keyValue;
  }

  // ── Mongoose CastError (bad ObjectId) ────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Noto'g'ri ID format: ${err.value}`;
    details = { path: err.path, value: err.value };
  }

  // ── JWT Errors ───────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token yaroqsiz';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token muddati tugagan';
  }

  // ── Mongoose Connection Error ─────────────────────────
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError') {
    statusCode = 503;
    message = 'Vaqtincha texnik nosozlik. Iltimos qayta urinib ko\'ring.';
    console.error('MongoDB Error:', err.message);
  }

  // ── Log in production too (errors only) ──────────────
  if (statusCode >= 500) {
    console.error(`[ERROR ${statusCode}] ${req.method} ${req.path} — ${message}`);
    if (err.stack && process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
