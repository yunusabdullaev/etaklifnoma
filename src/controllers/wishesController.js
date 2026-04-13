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
    const parts = bot.split(':');
    const botToken = parts.slice(0, -1).join(':');
    const chatId = parts[parts.length - 1];

    if (botToken && chatId) {
      try {
        const text = [
          `💌 *Yangi tilak keldi!*`, '',
          `👤 *Ism:* ${name}`,
          `💬 *Tilak:* ${message}`, '',
          `📎 _Taklifnoma: ${slug}_`,
        ].join('\n');

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
        });
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
