const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || '';
const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID || '';

/**
 * Send message to Telegram support chat
 */
async function sendToTelegram(text) {
  if (!SUPPORT_BOT_TOKEN || !SUPPORT_CHAT_ID) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${SUPPORT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: SUPPORT_CHAT_ID,
        text,
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
 * POST /api/support — create a new ticket (first message)
 */
exports.createTicket = catchAsync(async (req, res) => {
  const { subject, message } = req.body;
  const { SupportTicket, SupportMessage } = require('../models');

  if (!subject || !message) {
    throw AppError.badRequest('Mavzu va xabar kiritilishi shart');
  }

  const ticket = await SupportTicket.create({
    userId: req.user.id,
    subject: subject.trim(),
    message: message.trim(),
  });

  // Create first message
  await SupportMessage.create({
    ticketId: ticket.id,
    sender: 'user',
    text: message.trim(),
  });

  // Send to Telegram
  const tgMsg = `🆘 <b>Yangi murojaat #${ticket.id.slice(0, 8)}</b>\n\n` +
    `👤 <b>${req.user.name}</b> (${req.user.phone})\n` +
    `📋 <b>${ticket.subject}</b>\n` +
    `💬 ${ticket.message}\n\n` +
    `📝 Javob: <code>/reply ${ticket.id.slice(0, 8)} Javobingiz...</code>`;

  const tgMsgId = await sendToTelegram(tgMsg);
  if (tgMsgId) {
    await ticket.update({ telegramMessageId: tgMsgId });
  }

  ApiResponse.success(res, { ticket }, 'Murojaat yuborildi', 201);
});

/**
 * POST /api/support/:id/messages — add a new message to ticket (chat)
 */
exports.addMessage = catchAsync(async (req, res) => {
  const { text } = req.body;
  const { SupportTicket, SupportMessage } = require('../models');

  if (!text || !text.trim()) {
    throw AppError.badRequest('Xabar kiritilishi shart');
  }

  const ticket = await SupportTicket.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{ association: 'user', attributes: ['name', 'phone'] }],
  });

  if (!ticket) throw AppError.notFound('Murojaat topilmadi');

  const msg = await SupportMessage.create({
    ticketId: ticket.id,
    sender: 'user',
    text: text.trim(),
  });

  // Update ticket status
  await ticket.update({ status: 'open' });

  // Notify Telegram
  const tgMsg = `💬 <b>#${ticket.id.slice(0, 8)}</b> — yangi xabar\n\n` +
    `👤 ${ticket.user?.name || req.user.name}\n` +
    `💬 ${text.trim()}\n\n` +
    `📝 <code>/reply ${ticket.id.slice(0, 8)} Javob...</code>`;
  await sendToTelegram(tgMsg);

  ApiResponse.success(res, msg);
});

/**
 * GET /api/support — get current user's tickets
 */
exports.getMyTickets = catchAsync(async (req, res) => {
  const { SupportTicket, SupportMessage } = require('../models');

  const tickets = await SupportTicket.findAll({
    where: { userId: req.user.id },
    order: [['updated_at', 'DESC']],
    include: [{
      association: 'messages',
      order: [['created_at', 'DESC']],
      limit: 1,
    }],
  });

  ApiResponse.success(res, tickets);
});

/**
 * GET /api/support/:id — get ticket with all messages
 */
exports.getTicket = catchAsync(async (req, res) => {
  const { SupportTicket } = require('../models');

  const ticket = await SupportTicket.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: [{
      association: 'messages',
      order: [['created_at', 'ASC']],
    }],
  });

  if (!ticket) throw AppError.notFound('Murojaat topilmadi');

  ApiResponse.success(res, ticket);
});
