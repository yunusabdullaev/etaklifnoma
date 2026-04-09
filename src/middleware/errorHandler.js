const AppError = require('../utils/AppError');

/**
 * Global error-handling middleware.
 * Handles AppError, Sequelize errors, and unknown errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation error';
    details = err.errors?.map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  // Sequelize foreign key constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Referenced resource does not exist';
    details = { constraint: err.index };
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    statusCode = 400;
    message = 'Database error';
    if (process.env.NODE_ENV === 'development') {
      details = err.original?.message;
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('━━━ ERROR ━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Status : ${statusCode}`);
    console.error(`Message: ${message}`);
    if (details) console.error('Details:', details);
    console.error(err.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
