const { body, param, query } = require('express-validator');
const { eventTypes } = require('../config/app');

exports.createEventType = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isIn(eventTypes).withMessage(`Name must be one of: ${eventTypes.join(', ')}`),
  body('label')
    .trim()
    .notEmpty().withMessage('Label is required')
    .isLength({ max: 100 }).withMessage('Label must be at most 100 characters'),
  body('description')
    .optional()
    .trim(),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 }),
];

exports.updateEventType = [
  param('id').isUUID().withMessage('Invalid event type ID'),
  body('label')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('description')
    .optional()
    .trim(),
  body('icon')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean(),
];

exports.getById = [
  param('id').isUUID().withMessage('Invalid ID format'),
];

exports.createTemplate = [
  body('eventTypeId')
    .notEmpty().withMessage('Event type ID is required')
    .isUUID().withMessage('Invalid event type ID'),
  body('name')
    .trim()
    .notEmpty().withMessage('Template name is required')
    .isLength({ min: 2, max: 150 }).withMessage('Name must be 2–150 characters'),
  body('description')
    .optional()
    .trim(),
  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL().withMessage('Invalid thumbnail URL'),
  body('structure')
    .optional()
    .isObject().withMessage('Structure must be a JSON object'),
  body('htmlContent')
    .optional()
    .trim(),
  body('cssContent')
    .optional()
    .trim(),
  body('isPremium')
    .optional()
    .isBoolean(),
  body('sortOrder')
    .optional()
    .isInt({ min: 0 }),
];

exports.updateTemplate = [
  param('id').isUUID().withMessage('Invalid template ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 }),
  body('description')
    .optional()
    .trim(),
  body('structure')
    .optional()
    .isObject(),
  body('htmlContent')
    .optional()
    .trim(),
  body('cssContent')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean(),
  body('isPremium')
    .optional()
    .isBoolean(),
];

exports.createInvitation = [
  body('eventTypeId')
    .notEmpty().withMessage('Event type ID is required')
    .isUUID().withMessage('Invalid event type ID'),
  body('templateId')
    .optional()
    .isUUID().withMessage('Invalid template ID'),
  body('hostName')
    .trim()
    .notEmpty().withMessage('Host name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Host name must be 2–200 characters'),
  body('guestName')
    .optional()
    .trim()
    .isLength({ max: 200 }),
  body('eventTitle')
    .optional()
    .trim()
    .isLength({ max: 300 }),
  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isDate().withMessage('Event date must be a valid date (YYYY-MM-DD)'),
  body('eventTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    .withMessage('Event time must be in HH:MM or HH:MM:SS format'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 500 }),
  body('locationUrl')
    .optional()
    .trim()
    .isURL().withMessage('Location URL must be a valid URL'),
  body('message')
    .optional()
    .trim(),
  body('customFields')
    .optional()
    .isObject().withMessage('Custom fields must be a JSON object'),
  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Expires at must be a valid ISO 8601 date'),
];

exports.updateInvitation = [
  param('id').isUUID().withMessage('Invalid invitation ID'),
  body('hostName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }),
  body('guestName')
    .optional()
    .trim()
    .isLength({ max: 200 }),
  body('eventTitle')
    .optional()
    .trim()
    .isLength({ max: 300 }),
  body('eventDate')
    .optional()
    .isDate(),
  body('eventTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 500 }),
  body('locationUrl')
    .optional()
    .trim()
    .isURL(),
  body('message')
    .optional()
    .trim(),
  body('customFields')
    .optional()
    .isObject(),
  body('isPublished')
    .optional()
    .isBoolean(),
];

exports.getBySlug = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Invalid slug format'),
];

exports.pagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
