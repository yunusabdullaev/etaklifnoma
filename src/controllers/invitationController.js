const { Invitation, EventType, Template } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const appConfig = require('../config/app');

/**
 * GET /api/invitations
 */
exports.getAll = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};
  if (req.query.eventTypeId) where.eventTypeId = req.query.eventTypeId;
  if (req.query.isPublished !== undefined) where.isPublished = req.query.isPublished === 'true';

  const { rows, count } = await Invitation.findAndCountAll({
    where,
    include: [
      { association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] },
      { association: 'template', attributes: ['id', 'name', 'slug'] },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  ApiResponse.paginated(res, { rows, count, page, limit });
});

/**
 * GET /api/invitations/my
 * Returns invitations belonging to the logged-in user
 */
exports.getMyInvitations = catchAsync(async (req, res) => {
  if (!req.user) throw AppError.unauthorized('Tizimga kiring');

  const invitations = await Invitation.findAll({
    where: { userId: req.user.id },
    include: [
      { association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] },
      { association: 'template', attributes: ['id', 'name', 'slug'] },
    ],
    order: [['created_at', 'DESC']],
  });

  // Attach public URLs
  const data = invitations.map(inv => {
    const json = inv.toJSON();
    json.publicUrl = `${appConfig.appUrl}/invite/${json.slug}`;
    json.viewUrl = `${appConfig.appUrl}/invite/${json.slug}/view`;
    return json;
  });

  ApiResponse.success(res, data);
});

/**
 * GET /api/invitations/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const invitation = await Invitation.findByPk(req.params.id, {
    include: [
      { association: 'eventType' },
      { association: 'template' },
    ],
  });
  if (!invitation) throw AppError.notFound('Invitation not found');
  ApiResponse.success(res, invitation);
});

/**
 * POST /api/invitations
 */
exports.create = catchAsync(async (req, res) => {
  const { eventTypeId, templateId } = req.body;

  // Verify event type
  const eventType = await EventType.findByPk(eventTypeId);
  if (!eventType) throw AppError.badRequest('Invalid event type ID');

  // Verify template if provided
  if (templateId) {
    const template = await Template.findByPk(templateId);
    if (!template) throw AppError.badRequest('Invalid template ID');
    if (template.eventTypeId !== eventTypeId) {
      throw AppError.badRequest('Template does not belong to the selected event type');
    }
  }

  // Slug is auto-generated in model hook
  // Attach user if logged in
  const createData = { ...req.body };
  if (req.user) createData.userId = req.user.id;

  const invitation = await Invitation.create(createData);

  // Re-fetch with associations
  const fullInvitation = await Invitation.findByPk(invitation.id, {
    include: [
      { association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] },
      { association: 'template', attributes: ['id', 'name', 'slug'] },
    ],
  });

  // Attach the public link
  const data = fullInvitation.toJSON();
  data.publicUrl = `${appConfig.appUrl}/invite/${data.slug}`;

  ApiResponse.created(res, data);
});

/**
 * PUT /api/invitations/:id
 */
exports.update = catchAsync(async (req, res) => {
  const invitation = await Invitation.findByPk(req.params.id);
  if (!invitation) throw AppError.notFound('Invitation not found');

  // Prevent slug modification
  delete req.body.slug;

  await invitation.update(req.body);

  const updated = await Invitation.findByPk(invitation.id, {
    include: [
      { association: 'eventType', attributes: ['id', 'name', 'label', 'icon'] },
      { association: 'template', attributes: ['id', 'name', 'slug'] },
    ],
  });

  ApiResponse.success(res, updated);
});

/**
 * DELETE /api/invitations/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const invitation = await Invitation.findByPk(req.params.id);
  if (!invitation) throw AppError.notFound('Invitation not found');

  await invitation.destroy();
  ApiResponse.noContent(res);
});

/**
 * GET /invite/:slug  (PUBLIC)
 * Public endpoint — increments view count.
 */
exports.getBySlug = catchAsync(async (req, res) => {
  const invitation = await Invitation.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [
      { association: 'eventType' },
      { association: 'template' },
    ],
  });

  if (!invitation) throw AppError.notFound('Invitation not found');

  // Check expiration
  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    throw AppError.notFound('This invitation has expired');
  }

  // Increment view count (fire-and-forget)
  invitation.increment('viewCount');

  ApiResponse.success(res, invitation);
});
