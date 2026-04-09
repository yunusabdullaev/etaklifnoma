const { EventType } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * GET /api/event-types
 */
exports.getAll = catchAsync(async (_req, res) => {
  const eventTypes = await EventType.findAll({
    order: [['name', 'ASC']],
  });
  ApiResponse.success(res, eventTypes);
});

/**
 * GET /api/event-types/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const eventType = await EventType.findByPk(req.params.id, {
    include: [{ association: 'templates', where: { isActive: true }, required: false }],
  });
  if (!eventType) throw AppError.notFound('Event type not found');
  ApiResponse.success(res, eventType);
});

/**
 * POST /api/event-types
 */
exports.create = catchAsync(async (req, res) => {
  const { name, label, description, icon } = req.body;
  const existing = await EventType.findOne({ where: { name } });
  if (existing) throw AppError.conflict(`Event type "${name}" already exists`);

  const eventType = await EventType.create({ name, label, description, icon });
  ApiResponse.created(res, eventType);
});

/**
 * PUT /api/event-types/:id
 */
exports.update = catchAsync(async (req, res) => {
  const eventType = await EventType.findByPk(req.params.id);
  if (!eventType) throw AppError.notFound('Event type not found');

  const { label, description, icon, isActive } = req.body;
  await eventType.update({ label, description, icon, isActive });
  ApiResponse.success(res, eventType);
});

/**
 * DELETE /api/event-types/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const eventType = await EventType.findByPk(req.params.id);
  if (!eventType) throw AppError.notFound('Event type not found');

  await eventType.destroy();
  ApiResponse.noContent(res);
});
