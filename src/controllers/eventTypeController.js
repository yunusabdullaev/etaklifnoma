const { EventType, Template } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * GET /api/event-types
 */
exports.getAll = catchAsync(async (_req, res) => {
  const eventTypes = await EventType.find().sort({ name: 1 });
  ApiResponse.success(res, eventTypes);
});

/**
 * GET /api/event-types/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const eventType = await EventType.findById(req.params.id);
  if (!eventType) throw AppError.notFound('Event type not found');

  const templates = await Template.find({ eventTypeId: eventType._id, isActive: true });
  ApiResponse.success(res, { ...eventType.toObject(), templates });
});

/**
 * POST /api/event-types
 */
exports.create = catchAsync(async (req, res) => {
  const { name, label, description, icon } = req.body;
  const existing = await EventType.findOne({ name });
  if (existing) throw AppError.conflict(`Event type "${name}" already exists`);

  const eventType = await EventType.create({ name, label, description, icon });
  ApiResponse.created(res, eventType);
});

/**
 * PUT /api/event-types/:id
 */
exports.update = catchAsync(async (req, res) => {
  const eventType = await EventType.findById(req.params.id);
  if (!eventType) throw AppError.notFound('Event type not found');

  const { label, description, icon, isActive } = req.body;
  Object.assign(eventType, { label, description, icon, isActive });
  await eventType.save();
  ApiResponse.success(res, eventType);
});

/**
 * DELETE /api/event-types/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const eventType = await EventType.findById(req.params.id);
  if (!eventType) throw AppError.notFound('Event type not found');
  await eventType.deleteOne();
  ApiResponse.noContent(res);
});
