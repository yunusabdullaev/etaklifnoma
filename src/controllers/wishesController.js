const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const PLATFORM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

/**
 * POST /api/wishes
 */
exports.send = catchAsync(async (req, res) => {
  const { name, message, slug } = req.body;
  let chatId = req.body.chatId || '';
  let botToken = PLATFORM_BOT_TOKEN;

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

  // Save to DB
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

  // Try to look up chatId from invitation if not provided
  if (!chatId) {
    try {
      const { Invitation } = require('../models');
      const inv = await Invitation.findOne({ slug });
      if (inv?.customFields?.telegramChatId) {
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

      const tgRes = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      });
      const tgData = await tgRes.json();
      if (!tgData.ok) {
        console.error('[wishes] Telegram error:', JSON.stringify(tgData));
      }
    } catch (tgErr) {
      console.error('[wishes] Telegram fetch error:', tgErr.message);
    }
  }

  ApiResponse.success(res, { sent: true }, 'Tilak qabul qilindi!');
});

/**
 * GET /api/wishes/:slug
 */
exports.getBySlug = catchAsync(async (req, res) => {
  try {
    const { Wish } = require('../models');
    const wishes = await Wish.find({ invitationSlug: req.params.slug }).sort({ createdAt: -1 });
    ApiResponse.success(res, wishes);
  } catch (err) {
    console.error('[wishes] getBySlug error:', err.message);
    ApiResponse.success(res, []);
  }
});
