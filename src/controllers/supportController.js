const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || '';
const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID || '';

async function sendToTelegram(text) {
  if (!SUPPORT_BOT_TOKEN || !SUPPORT_CHAT_ID) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${SUPPORT_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: SUPPORT_CHAT_ID, text, parse_mode: 'HTML' }),
    });
    const data = await res.json();
    return data.ok ? String(data.result.message_id) : null;
  } catch (err) {
    console.error('Support Telegram error:', err.message);
    return null;
  }
}

/**
 * POST /api/support
 */
exports.createTicket = catchAsync(async (req, res) => {
  const { subject, message } = req.body;
  const { SupportTicket, SupportMessage } = require('../models');

  if (!subject || !message) throw AppError.badRequest('Mavzu va xabar kiritilishi shart');

  const ticket = await SupportTicket.create({
    userId: req.user._id,
    subject: subject.trim(),
    message: message.trim(),
  });

  await SupportMessage.create({
    ticketId: ticket._id,
    sender: 'user',
    text: message.trim(),
  });

  const shortId = String(ticket._id).slice(-8);
  const tgMsg = `🆘 <b>Yangi murojaat #${shortId}</b>\n\n` +
    `👤 <b>${req.user.name}</b> (${req.user.phone})\n` +
    `📋 <b>${ticket.subject}</b>\n` +
    `💬 ${ticket.message}\n\n` +
    `📝 Javob: <code>/reply ${shortId} Javobingiz...</code>`;

  const tgMsgId = await sendToTelegram(tgMsg);
  if (tgMsgId) {
    ticket.telegramMessageId = tgMsgId;
    await ticket.save();
  }

  ApiResponse.success(res, { ticket }, 'Murojaat yuborildi', 201);
});

/**
 * POST /api/support/:id/messages
 */
exports.addMessage = catchAsync(async (req, res) => {
  const { text } = req.body;
  const { SupportTicket, SupportMessage } = require('../models');

  if (!text?.trim()) throw AppError.badRequest('Xabar kiritilishi shart');

  const ticket = await SupportTicket.findOne({ _id: req.params.id, userId: req.user._id });
  if (!ticket) throw AppError.notFound('Murojaat topilmadi');

  const msg = await SupportMessage.create({
    ticketId: ticket._id,
    sender: 'user',
    text: text.trim(),
  });

  ticket.status = 'open';
  await ticket.save();

  const shortId = String(ticket._id).slice(-8);
  const tgMsg = `💬 <b>#${shortId}</b> — yangi xabar\n\n` +
    `👤 ${req.user.name}\n` +
    `💬 ${text.trim()}\n\n` +
    `📝 <code>/reply ${shortId} Javob...</code>`;
  await sendToTelegram(tgMsg);

  ApiResponse.success(res, msg);
});

/**
 * GET /api/support
 */
exports.getMyTickets = catchAsync(async (req, res) => {
  const { SupportTicket } = require('../models');
  const tickets = await SupportTicket.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  ApiResponse.success(res, tickets);
});

/**
 * GET /api/support/:id
 */
exports.getTicket = catchAsync(async (req, res) => {
  const { SupportTicket, SupportMessage } = require('../models');
  const ticket = await SupportTicket.findOne({ _id: req.params.id, userId: req.user._id });
  if (!ticket) throw AppError.notFound('Murojaat topilmadi');

  const messages = await SupportMessage.find({ ticketId: ticket._id }).sort({ createdAt: 1 });
  ApiResponse.success(res, { ...ticket.toObject(), messages });
});
