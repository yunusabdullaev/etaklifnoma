const { Invitation, EventType, Template } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const { renderInvitation, renderPreviewFragment } = require('../utils/templateEngine');

/**
 * GET /api/invitations/:id/render
 */
exports.renderById = catchAsync(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id)
    .populate('eventTypeId')
    .populate('templateId');
  if (!invitation) throw AppError.notFound('Invitation not found');

  const inv = invitation.toObject();
  const html = renderInvitation(inv, inv.eventTypeId, inv.templateId);
  res.set('Content-Type', 'text/html');
  res.send(html);
});

/**
 * GET /invite/:slug/view
 */
exports.renderBySlug = catchAsync(async (req, res) => {
  const invitation = await Invitation.findOne({ slug: req.params.slug, isPublished: true })
    .populate('eventTypeId')
    .populate('templateId');

  if (!invitation) throw AppError.notFound('Invitation not found');

  if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
    throw AppError.notFound('This invitation has expired');
  }

  // Increment view count
  await Invitation.findByIdAndUpdate(invitation._id, { $inc: { viewCount: 1 } });

  const inv = invitation.toObject();
  const html = renderInvitation(inv, inv.eventTypeId, inv.templateId);
  res.removeHeader('Content-Security-Policy');
  res.set('Content-Type', 'text/html');
  res.send(html);
});

/**
 * POST /api/preview
 */
exports.preview = catchAsync(async (req, res) => {
  const { templateId } = req.body;

  let template = null;
  let eventType = null;

  if (templateId) {
    template = await Template.findById(templateId).populate('eventTypeId');
    if (template) eventType = template.eventTypeId;
  }

  if (!eventType && req.body.eventTypeId) {
    eventType = await EventType.findById(req.body.eventTypeId);
  }

  const { html, css } = renderPreviewFragment(req.body, eventType, template);
  ApiResponse.success(res, { html, css });
});

/**
 * POST /api/preview/full
 */
exports.fullPreview = catchAsync(async (req, res) => {
  const { templateId } = req.body;

  let template = null;
  let eventType = null;

  if (templateId) {
    template = await Template.findById(templateId).populate('eventTypeId');
    if (template) eventType = template.eventTypeId;
  }

  if (!eventType && req.body.eventTypeId) {
    eventType = await EventType.findById(req.body.eventTypeId);
  }

  const fakeInvitation = {
    slug: 'preview',
    eventTitle: req.body.eventTitle || '',
    hostName: req.body.hostName || '',
    guestName: req.body.guestName || '',
    eventDate: req.body.eventDate || '',
    eventTime: req.body.eventTime || '',
    location: req.body.location || '',
    locationUrl: req.body.locationUrl || '',
    message: req.body.message || '',
    customFields: req.body.customFields || {},
    brideName: req.body.customFields?.brideName || '',
    groomName: req.body.customFields?.groomName || '',
  };

  const html = renderInvitation(fakeInvitation, eventType, template);
  res.removeHeader('Content-Security-Policy');
  res.set('Content-Type', 'text/html');
  res.send(html);
});
