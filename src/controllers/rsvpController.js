const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * POST /api/invitations/:slug/rsvp — guest submits attendance
 */
exports.submitRsvp = catchAsync(async (req, res) => {
  const { Rsvp } = require('../models');
  const { guestName, status, guestCount, message, phone } = req.body;

  if (!guestName || !status) {
    return res.status(400).json({ success: false, error: { message: 'Ism va holat kiritilishi shart' } });
  }

  const rsvp = await Rsvp.create({
    invitationSlug: req.params.slug,
    guestName: guestName.trim(),
    status,
    guestCount: guestCount || 1,
    message: message?.trim() || null,
    phone: phone?.trim() || null,
  });

  ApiResponse.success(res, rsvp, 'RSVP qabul qilindi', 201);
});

/**
 * GET /api/invitations/:slug/rsvp — owner gets RSVP list
 */
exports.getRsvps = catchAsync(async (req, res) => {
  const { Rsvp } = require('../models');

  const rsvps = await Rsvp.findAll({
    where: { invitationSlug: req.params.slug },
    order: [['created_at', 'DESC']],
  });

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.status === 'attending').length,
    notAttending: rsvps.filter(r => r.status === 'not_attending').length,
    maybe: rsvps.filter(r => r.status === 'maybe').length,
    totalGuests: rsvps
      .filter(r => r.status === 'attending')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0),
  };

  ApiResponse.success(res, { rsvps, stats });
});
