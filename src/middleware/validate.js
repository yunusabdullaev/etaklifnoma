const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware that checks express-validator results and throws
 * a structured 400 error if any validation rules failed.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
    }));
    throw AppError.badRequest('Validation failed', details);
  }
  next();
};

module.exports = validate;
