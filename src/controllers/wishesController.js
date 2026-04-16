/**
 * Wishes Controller — saves wishes to DB and optionally forwards to Telegram.
 */
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * POST /api/wishes
 */
exports.send = catchAsync(async (req, res) => {
  const { name, message, bot, slug } = req.body;

  console.log('[wishes] Received:', { name, slug, hasBot: !!bot, botLen: bot?.length });

  if (!name || !message || !slug) {
    return ApiResponse.error(res, { message: 'Name, message and slug are required' }, 400);
  }

  // Try to save to DB (non-fatal if table doesn't exist yet)
  try {
    const { Wish } = require('../models');
    await Wish.create({
      invitationSlug: slug,
      guestName: name.trim(),
      message: message.trim(),
    });
    console.log('[wishes] Saved to DB OK');
  } catch (dbErr) {
    console.error('[wishes] DB save failed (continuing anyway):', dbErr.message);
  }

  // Forward to Telegram if bot configured
  if (bot && String(bot).trim().includes(':')) {
    const botStr = String(bot).trim();
    const lastColon = botStr.lastIndexOf(':');
    const botToken = botStr.substring(0, lastColon).trim();
    const chatId = botStr.substring(lastColon + 1).trim();

    console.log('[wishes] Telegram: botToken length:', botToken.length, '| chatId:', chatId);

    if (botToken && chatId) {
      try {
        const escapeHtml = (str) => String(str)
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

        const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        console.log('[wishes] Calling Telegram API:', tgUrl.replace(botToken, 'BOT_TOKEN'));

        const tgRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        });

        const tgData = await tgRes.json();
        if (!tgData.ok) {
          console.error('[wishes] Telegram API error:', JSON.stringify(tgData));
        } else {
          console.log('[wishes] Telegram message sent OK, message_id:', tgData.result?.message_id);
        }
      } catch (tgErr) {
        console.error('[wishes] Telegram fetch error:', tgErr.message);
      }
    } else {
      console.warn('[wishes] Could not parse botToken/chatId from bot string');
    }
  } else {
    console.log('[wishes] No Telegram bot configured (bot field empty or missing colon)');
  }

  ApiResponse.success(res, { sent: true }, 'Tilak qabul qilindi!');
});

/**
 * GET /api/wishes/:slug — owner gets wishes list
 */
exports.getBySlug = catchAsync(async (req, res) => {
  try {
    const { Wish } = require('../models');
    const wishes = await Wish.findAll({
      where: { invitationSlug: req.params.slug },
      order: [['created_at', 'DESC']],
    });
    ApiResponse.success(res, wishes);
  } catch (err) {
    console.error('[wishes] getBySlug error:', err.message);
    ApiResponse.success(res, []);
  }
});
