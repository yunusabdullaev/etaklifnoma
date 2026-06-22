const slugify = require('slugify');
const { Template, EventType } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
// Simple in-memory cache for template list (5 min TTL)
const _cache = {};
const CACHE_TTL = 5 * 60 * 1000;

/**
 * GET /api/templates
 */
exports.getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const includeContent = req.query.includeContent === 'true';

  const filter = { isActive: true };
  if (req.query.eventTypeId) filter.eventTypeId = req.query.eventTypeId;
  if (req.query.isPremium !== undefined) filter.isPremium = req.query.isPremium === 'true';

  // Cache key based on query params (only for non-content requests)
  const cacheKey = !includeContent ? `tpl:${JSON.stringify(filter)}:${page}:${limit}` : null;
  if (cacheKey && _cache[cacheKey] && Date.now() - _cache[cacheKey].ts < CACHE_TTL) {
    return res.status(200).json(_cache[cacheKey].json);
  }

  let query = Template.find(filter)
    .populate('eventTypeId', 'id name label icon')
    .sort({ sortOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!includeContent) {
    query = query.select('-htmlContent -cssContent');
  }

  const [rows, count] = await Promise.all([
    query,
    Template.countDocuments(filter),
  ]);

  const result = { rows, count, page, limit };
  const jsonBody = { success: true, data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  if (cacheKey) _cache[cacheKey] = { json: jsonBody, ts: Date.now() };
  ApiResponse.paginated(res, result);
});

/**
 * GET /api/templates/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const template = await Template.findById(req.params.id)
    .populate('eventTypeId', 'id name label icon');
  if (!template) throw AppError.notFound('Template not found');
  ApiResponse.success(res, template);
});

/**
 * POST /api/templates
 */
exports.create = catchAsync(async (req, res) => {
  const { eventTypeId, name } = req.body;

  const eventType = await EventType.findById(eventTypeId);
  if (!eventType) throw AppError.badRequest('Invalid event type ID');

  let slug = slugify(name, { lower: true, strict: true });
  const existingSlug = await Template.findOne({ slug });
  if (existingSlug) slug = `${slug}-${Date.now()}`;

  const template = await Template.create({ ...req.body, slug });
  ApiResponse.created(res, template);
});

/**
 * PUT /api/templates/:id
 */
exports.update = catchAsync(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) throw AppError.notFound('Template not found');

  if (req.body.name && req.body.name !== template.name) {
    let slug = slugify(req.body.name, { lower: true, strict: true });
    const existing = await Template.findOne({ slug });
    if (existing && String(existing._id) !== String(template._id)) slug = `${slug}-${Date.now()}`;
    req.body.slug = slug;
  }

  Object.assign(template, req.body);
  await template.save();
  ApiResponse.success(res, template);
});

/**
 * DELETE /api/templates/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) throw AppError.notFound('Template not found');
  await template.deleteOne();
  ApiResponse.noContent(res);
});
