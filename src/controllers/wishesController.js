/**
 * Wishes Controller — receives guest wishes and forwards to Telegram bot.
 */
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

/**
 * POST /api/wishes
 * Body: { name, message, bot (telegram bot token + chat_id), slug }
 * Format for bot: "BOT_TOKEN:CHAT_ID"
 */
exports.send = catchAsync(async (req, res) => {
  const { name, message, bot, slug } = req.body;

  if (!name || !message) {
    return ApiResponse.error(res, { message: 'Name and message are required' }, 400);
  }

  if (!bot) {
    return ApiResponse.error(res, { message: 'Telegram bot not configured' }, 400);
  }

  // Parse bot config: "BOT_TOKEN:CHAT_ID"
  const [botToken, chatId] = bot.split(':');
  if (!botToken || !chatId) {
    return ApiResponse.error(res, { message: 'Invalid bot configuration' }, 400);
  }

  // Build Telegram message
  const text = [
    `💌 *Yangi tilak keldi!*`,
    ``,
    `👤 *Ism:* ${name}`,
    `💬 *Tilak:* ${message}`,
    ``,
    `📎 _Taklifnoma: ${slug}_`,
  ].join('\n');

  try {
    // Send to Telegram Bot API
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (data.ok) {
      ApiResponse.success(res, { sent: true }, 'Tilak yuborildi!');
    } else {
      console.error('Telegram API error:', data);
      ApiResponse.error(res, { message: 'Telegram xatoligi' }, 500);
    }
  } catch (error) {
    console.error('Telegram send error:', error.message);
    ApiResponse.error(res, { message: 'Telegram ga yuborib bo\'lmadi' }, 500);
  }
});
