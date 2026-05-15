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
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.eventTypeId) filter.eventTypeId = req.query.eventTypeId;
  if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';

  const [rows, count] = await Promise.all([
    Invitation.find(filter)
      .populate('eventTypeId', 'id name label icon')
      .populate('templateId', 'id name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Invitation.countDocuments(filter),
  ]);

  ApiResponse.paginated(res, { rows, count, page, limit });
});

/**
 * GET /api/invitations/my
 */
exports.getMyInvitations = catchAsync(async (req, res) => {
  if (!req.user) throw AppError.unauthorized('Tizimga kiring');

  const invitations = await Invitation.find({ userId: req.user._id })
    .populate('eventTypeId', 'id name label icon')
    .populate('templateId', 'id name slug')
    .sort({ createdAt: -1 });

  const data = invitations.map(inv => {
    const json = inv.toObject({ virtuals: true });
    json.id = json._id;
    json.publicUrl = `${appConfig.appUrl}/invite/${json.slug}`;
    json.viewUrl = `${appConfig.appUrl}/invite/${json.slug}/view`;

    if (json.customFields) {
      const { photos, musicUrl, ...lightFields } = json.customFields;
      json.customFields = {
        ...lightFields,
        hasPhotos: Array.isArray(photos) && photos.length > 0,
        photosCount: Array.isArray(photos) ? photos.length : 0,
        hasMusic: !!musicUrl,
      };
    }
    return json;
  });

  ApiResponse.success(res, data);
});

/**
 * GET /api/invitations/:id
 */
exports.getById = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id)
    .populate('eventTypeId')
    .populate('templateId');
  if (!invitation) throw AppError.notFound('Invitation not found');
  ApiResponse.success(res, invitation);
});

/**
 * POST /api/invitations
 */
exports.create = catchAsync(async (req, res) => {
  const { eventTypeId, templateId } = req.body;

  const eventType = await EventType.findById(eventTypeId);
  if (!eventType) throw AppError.badRequest('Invalid event type ID');

  if (templateId) {
    const template = await Template.findById(templateId);
    if (!template) throw AppError.badRequest('Invalid template ID');
    if (String(template.eventTypeId) !== String(eventTypeId)) {
      throw AppError.badRequest('Template does not belong to the selected event type');
    }
  }

  if (req.body.eventDate) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const eventDate = new Date(req.body.eventDate);
    const maxDate = new Date(today.getTime() + 89 * 24 * 60 * 60 * 1000);
    if (eventDate < today) throw AppError.badRequest('O\'tgan sanani tanlash mumkin emas');
    if (eventDate > maxDate) throw AppError.badRequest('Maximum 89 kundan keyin bo\'lishi mumkin');
  }

  const cleanData = { ...req.body };
  if (req.user) cleanData.userId = req.user._id;

  ['guestName', 'eventTitle', 'eventTime', 'locationUrl', 'message'].forEach(key => {
    if (cleanData[key] === '' || cleanData[key] === undefined) {
      cleanData[key] = null;
    }
  });

  if (cleanData.customFields && typeof cleanData.customFields === 'object') {
    Object.keys(cleanData.customFields).forEach(key => {
      if (cleanData.customFields[key] === '' || cleanData.customFields[key] === undefined) {
        delete cleanData.customFields[key];
      }
    });
    if (Object.keys(cleanData.customFields).length === 0) {
      cleanData.customFields = null;
    }
  }

  // Handle custom slug
  if (cleanData.customFields?.customSlug) {
    const rawSlug = cleanData.customFields.customSlug.trim().toLowerCase();
    if (!/^[a-z0-9-]{3,30}$/.test(rawSlug)) {
      throw AppError.badRequest('Maxsus manzil faqat lotin harflari, raqamlar va defisdan iborat bo\'lishi kerak (3-30 belgi)');
    }
    const existing = await Invitation.findOne({ slug: rawSlug });
    if (existing) {
      throw AppError.badRequest(`"${rawSlug}" manzili allaqachon band. Boshqa nom tanlang.`);
    }
    cleanData.slug = rawSlug;
    delete cleanData.customFields.customSlug;
  }

  let invitation;
  try {
    invitation = await Invitation.create(cleanData);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      throw AppError.badRequest(messages);
    }
    throw err;
  }

  const fullInvitation = await Invitation.findById(invitation._id)
    .populate('eventTypeId', 'id name label icon')
    .populate('templateId', 'id name slug');

  const data = fullInvitation.toObject({ virtuals: true });
  data.id = data._id;
  data.publicUrl = `${appConfig.appUrl}/invite/${data.slug}`;

  ApiResponse.created(res, data);
});

/**
 * PUT /api/invitations/:id
 */
exports.update = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) throw AppError.notFound('Invitation not found');

  delete req.body.slug;
  delete req.body.eventDate;

  if (req.body.customFields) {
    req.body.customFields = { ...(invitation.customFields || {}), ...req.body.customFields };
  }

  Object.assign(invitation, req.body);
  invitation.markModified('customFields'); // required for Mongoose Mixed type
  await invitation.save();


  const updated = await Invitation.findById(invitation._id)
    .populate('eventTypeId', 'id name label icon')
    .populate('templateId', 'id name slug');

  ApiResponse.success(res, updated);
});

/**
 * DELETE /api/invitations/:id
 */
exports.remove = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) throw AppError.notFound('Invitation not found');
  await invitation.deleteOne();
  ApiResponse.noContent(res);
});

/**
 * GET /invite/:slug (PUBLIC)
 */
exports.getBySlug = catchAsync(async (req, res) => {
  const invitation = await Invitation.findOne({ slug: req.params.slug, isPublished: true })
    .populate('eventTypeId')
    .populate('templateId');

  if (!invitation) throw AppError.notFound('Invitation not found');

  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    throw AppError.notFound('This invitation has expired');
  }

  ApiResponse.success(res, invitation);
});

/**
 * GET /api/invitations/check-slug
 */
exports.checkSlug = catchAsync(async (req, res) => {
  let { slug } = req.query;
  if (!slug) return res.json({ available: false, missing: true });

  slug = slug.toLowerCase().trim();
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    return res.json({ available: false, error: 'Lotin harflari, raqamlar va chiziqcha (-). Kamida 3ta belgi.' });
  }
  const existing = await Invitation.findOne({ slug });
  if (existing) {
    return res.json({ available: false, error: 'Bu manzil hozirda band. Iltimos, boshqasini tanlang.' });
  }
  return res.json({ available: true });
});
