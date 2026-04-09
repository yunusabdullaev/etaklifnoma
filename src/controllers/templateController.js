const slugify = require('slugify');
const { Template, EventType } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

/**
 * GET /api/templates
 */
exports.getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = { isActive: true };
  if (req.query.eventTypeId) where.eventTypeId = req.query.eventTypeId;
  if (req.query.isPremium !== undefined) where.isPremium = req.query.isPremium === 'true';

  const { rows, count } = await Template.findAndCountAll({
    where,
    include: [{ association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] }],
    order: [['sort_order', 'ASC'], ['created_at', 'DESC']],
    limit,
    offset,
  });

  ApiResponse.paginated(res, { rows, count, page, limit });
});

/**
 * GET /api/templates/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const template = await Template.findByPk(req.params.id, {
    include: [{ association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] }],
  });
  if (!template) throw AppError.notFound('Template not found');
  ApiResponse.success(res, template);
});

/**
 * POST /api/templates
 */
exports.create = catchAsync(async (req, res) => {
  const { eventTypeId, name } = req.body;

  // Verify event type exists
  const eventType = await EventType.findByPk(eventTypeId);
  if (!eventType) throw AppError.badRequest('Invalid event type ID');

  // Generate unique slug from name
  let slug = slugify(name, { lower: true, strict: true });
  const existingSlug = await Template.findOne({ where: { slug } });
  if (existingSlug) slug = `${slug}-${Date.now()}`;

  const template = await Template.create({ ...req.body, slug });
  ApiResponse.created(res, template);
});

/**
 * PUT /api/templates/:id
 */
exports.update = catchAsync(async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) throw AppError.notFound('Template not found');

  // Re-slug if the name changed
  if (req.body.name && req.body.name !== template.name) {
    let slug = slugify(req.body.name, { lower: true, strict: true });
    const existing = await Template.findOne({ where: { slug } });
    if (existing && existing.id !== template.id) slug = `${slug}-${Date.now()}`;
    req.body.slug = slug;
  }

  await template.update(req.body);
  ApiResponse.success(res, template);
});

/**
 * DELETE /api/templates/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) throw AppError.notFound('Template not found');

  await template.destroy();
  ApiResponse.noContent(res);
});
