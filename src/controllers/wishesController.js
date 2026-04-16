/**
 * Wishes Controller — saves wishes to DB and optionally forwards to Telegram.
 */
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * POST /api/wishes
 */
exports.send = catchAsync(async (req, res) => {
  const { Wish } = require('../models');
  const { name, message, bot, slug } = req.body;

  if (!name || !message || !slug) {
    return ApiResponse.error(res, { message: 'Name, message and slug are required' }, 400);
  }

  // Always save to DB
  await Wish.create({
    invitationSlug: slug,
    guestName: name.trim(),
    message: message.trim(),
  });

  // If Telegram bot configured, also forward there
  if (bot && bot.includes(':')) {
    // Format: FULL_BOT_TOKEN:CHAT_ID
    // Bot token itself has ':', so chatId is everything after the LAST ':'
    const lastColon = bot.lastIndexOf(':');
    const botToken = bot.substring(0, lastColon);
    const chatId = bot.substring(lastColon + 1);

    if (botToken && chatId) {
      try {
        // Use HTML parse_mode — Markdown silently fails on special chars like _ * [ ]
        const escapeHtml = (str) => str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        const text = [
          `💌 <b>Yangi tilak keldi!</b>`,
          ``,
          `👤 <b>Ism:</b> ${escapeHtml(name)}`,
          `💬 <b>Tilak:</b> ${escapeHtml(message)}`,
          ``,
          `📎 <i>Taklifnoma: ${escapeHtml(slug)}</i>`,
        ].join('\n');

        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        });

        const tgData = await tgRes.json();
        if (!tgData.ok) {
          console.error('Telegram API error:', JSON.stringify(tgData));
        }
      } catch (err) {
        console.error('Telegram wish forward error:', err.message);
      }
    }
  }

  ApiResponse.success(res, { sent: true }, 'Tilak qabul qilindi!');
});

/**
 * GET /api/wishes/:slug — owner gets wishes list
 */
exports.getBySlug = catchAsync(async (req, res) => {
  const { Wish } = require('../models');
  const wishes = await Wish.findAll({
    where: { invitationSlug: req.params.slug },
    order: [['created_at', 'DESC']],
  });
  ApiResponse.success(res, wishes);
});
