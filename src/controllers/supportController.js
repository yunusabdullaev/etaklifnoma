const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || '';
const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID || '';

/**
 * Send support ticket to Telegram
 */
async function sendTicketToTelegram(ticket, user) {
  if (!SUPPORT_BOT_TOKEN || !SUPPORT_CHAT_ID) {
    console.log('⚠️ Support bot: token/chat not configured');
    return null;
  }

  const msg = `🆘 <b>Yangi murojaat #${ticket.id.slice(0, 8)}</b>\n\n` +
    `👤 <b>${user.name}</b>\n` +
    `📱 ${user.phone}\n\n` +
    `📋 <b>${ticket.subject}</b>\n` +
    `💬 ${ticket.message}\n\n` +
    `🕐 ${new Date().toLocaleString('uz-UZ')}\n\n` +
    `📝 Javob berish uchun:\n<code>/reply ${ticket.id.slice(0, 8)} Javobingiz...</code>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${SUPPORT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: SUPPORT_CHAT_ID,
        text: msg,
        parse_mode: 'HTML',
      }),
    });
    const data = await res.json();
    return data.ok ? String(data.result.message_id) : null;
  } catch (err) {
    console.error('Support Telegram error:', err.message);
    return null;
  }
}

/**
 * POST /api/support — create a new support ticket
 */
exports.createTicket = catchAsync(async (req, res) => {
  const { subject, message } = req.body;
  const { SupportTicket } = require('../models');

  if (!subject || !message) {
    throw AppError.badRequest('Mavzu va xabar kiritilishi shart');
  }

  const ticket = await SupportTicket.create({
    userId: req.user.id,
    subject: subject.trim(),
    message: message.trim(),
  });

  // Send to Telegram
  const tgMsgId = await sendTicketToTelegram(ticket, req.user);
  if (tgMsgId) {
    await ticket.update({ telegramMessageId: tgMsgId });
  }

  ApiResponse.success(res, { ticket }, 'Murojaat yuborildi', 201);
});

/**
 * GET /api/support — get current user's tickets
 */
exports.getMyTickets = catchAsync(async (req, res) => {
  const { SupportTicket } = require('../models');

  const tickets = await SupportTicket.findAll({
    where: { userId: req.user.id },
    order: [['created_at', 'DESC']],
  });

  ApiResponse.success(res, tickets);
});

/**
 * GET /api/support/:id — get single ticket
 */
exports.getTicket = catchAsync(async (req, res) => {
  const { SupportTicket } = require('../models');

  const ticket = await SupportTicket.findOne({
    where: { id: req.params.id, userId: req.user.id },
  });

  if (!ticket) {
    throw AppError.notFound('Murojaat topilmadi');
  }

  ApiResponse.success(res, ticket);
});
