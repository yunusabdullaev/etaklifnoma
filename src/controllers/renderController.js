const { Invitation, EventType, Template } = require('../models');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const { renderInvitation, renderPreviewFragment } = require('../utils/templateEngine');

/**
 * GET /api/invitations/:id/render
 * Renders a saved invitation as full HTML page.
 */
exports.renderById = catchAsync(async (req, res) => {
  const invitation = await Invitation.findByPk(req.params.id, {
    include: [
      { association: 'eventType' },
      { association: 'template' },
    ],
  });
  if (!invitation) throw AppError.notFound('Invitation not found');

  const html = renderInvitation(invitation, invitation.eventType, invitation.template);
  res.set('Content-Type', 'text/html');
  res.send(html);
});

/**
 * GET /invite/:slug/view
 * Public endpoint — renders invitation as a beautiful HTML page.
 */
exports.renderBySlug = catchAsync(async (req, res) => {
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

  // Increment view count
  invitation.increment('viewCount');

  const html = renderInvitation(invitation, invitation.eventType, invitation.template);
  res.set('Content-Type', 'text/html');
  res.send(html);
});

/**
 * POST /api/preview
 * Real-time preview — renders template with provided data WITHOUT saving.
 * Body: { templateId, hostName, guestName, eventTitle, eventDate, eventTime,
 *          location, locationUrl, message, customFields }
 */
exports.preview = catchAsync(async (req, res) => {
  const { templateId } = req.body;

  let template = null;
  let eventType = null;

  if (templateId) {
    template = await Template.findByPk(templateId, {
      include: [{ association: 'eventType' }],
    });
    if (template) eventType = template.eventType;
  }

  // If no template, use eventTypeId to get event type info
  if (!eventType && req.body.eventTypeId) {
    eventType = await EventType.findByPk(req.body.eventTypeId);
  }

  const { html, css } = renderPreviewFragment(req.body, eventType, template);
  ApiResponse.success(res, { html, css });
});
