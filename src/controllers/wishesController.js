/**
 * Wishes Controller — saves wishes to DB and forwards to Telegram via platform bot.
 *
 * The platform uses a single shared Telegram bot (TELEGRAM_BOT_TOKEN env var).
 * Each invitation stores just the user's chat_id in customFields.telegramChatId.
 * When a guest sends a wish, it goes to the invitation owner's chat via the platform bot.
 */
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const PLATFORM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * POST /api/wishes
 */
exports.send = catchAsync(async (req, res) => {
  const { name, message, slug } = req.body;
  // Support both old format (bot field) and new format (chatId from DB)
  let chatId = req.body.chatId || '';
  let botToken = PLATFORM_BOT_TOKEN;

  // Legacy support: if old "bot" field is sent (TOKEN:CHATID format)
  if (!chatId && req.body.bot && String(req.body.bot).includes(':')) {
    const botStr = String(req.body.bot).trim();
    const lastColon = botStr.lastIndexOf(':');
    botToken = botStr.substring(0, lastColon).trim();
    chatId = botStr.substring(lastColon + 1).trim();
  }

  console.log('[wishes] Received:', { name, slug, chatId, hasPlatformToken: !!PLATFORM_BOT_TOKEN });

  if (!name || !message || !slug) {
    return ApiResponse.error(res, { message: 'Name, message and slug are required' }, 400);
  }

  // Try save to DB
  try {
    const { Wish } = require('../models');
    await Wish.create({
      invitationSlug: slug,
      guestName: name.trim(),
      message: message.trim(),
    });
    console.log('[wishes] Saved to DB OK');
  } catch (dbErr) {
    console.error('[wishes] DB save failed:', dbErr.message);
  }

  // If no chatId provided in form, try to look it up from invitation
  if (!chatId) {
    try {
      const { Invitation } = require('../models');
      const inv = await Invitation.findOne({ where: { slug } });
      if (inv && inv.customFields && inv.customFields.telegramChatId) {
        chatId = String(inv.customFields.telegramChatId).trim();
        console.log('[wishes] Found chatId from invitation DB:', chatId);
      }
    } catch (e) {
      console.error('[wishes] DB lookup error:', e.message);
    }
  }

  // Forward to Telegram
  if (botToken && chatId && /^-?\d+$/.test(chatId)) {
    try {
      const escapeHtml = (str) => String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const text = [
        '\u{1F48C} <b>Yangi tilak keldi!</b>',
        '',
        '\u{1F464} <b>Ism:</b> ' + escapeHtml(name),
        '\u{1F4AC} <b>Tilak:</b> ' + escapeHtml(message),
        '',
        '\u{1F4CE} <i>Taklifnoma: ' + escapeHtml(slug) + '</i>',
      ].join('\n');

      console.log('[wishes] Sending to Telegram, chatId:', chatId);
      const tgRes = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' }),
      });
      const tgData = await tgRes.json();
      if (!tgData.ok) {
        console.error('[wishes] Telegram error:', JSON.stringify(tgData));
      } else {
        console.log('[wishes] Telegram sent OK, msg_id:', tgData.result?.message_id);
      }
    } catch (tgErr) {
      console.error('[wishes] Telegram fetch error:', tgErr.message);
    }
  } else {
    console.log('[wishes] No Telegram: botToken?', !!botToken, 'chatId?', chatId);
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
