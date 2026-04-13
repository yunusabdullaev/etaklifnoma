/**
 * Telegram Admin Bot
 * 
 * Uses long-polling to listen for commands from the admin chat.
 * Commands:
 *   /users    — List all registered users
 *   /stats    — Show invitation statistics
 *   /start    — Welcome message with commands list
 */

const BOT_TOKEN = process.env.VERIFY_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.VERIFY_CHAT_ID || '';

let lastUpdateId = 0;
let polling = false;

/**
 * Make a Telegram Bot API request
 */
async function botApi(method, body = {}) {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram Bot API error (${method}):`, err.message);
    return null;
  }
}

/**
 * Send a message to admin chat
 */
async function sendMessage(text, parseMode = 'HTML') {
  return botApi('sendMessage', {
    chat_id: ADMIN_CHAT_ID,
    text,
    parse_mode: parseMode,
  });
}

/**
 * Handle /users command — list all registered users
 */
async function handleUsers() {
  try {
    const { User } = require('../models');
    const users = await User.findAll({
      order: [['created_at', 'DESC']],
      attributes: ['id', 'name', 'phone', 'isActive', 'createdAt'],
    });

    if (users.length === 0) {
      return sendMessage('📭 Hech qanday foydalanuvchi topilmadi.');
    }

    let msg = `👥 <b>Foydalanuvchilar ro'yxati</b> (${users.length} ta)\n\n`;

    users.forEach((u, i) => {
      const date = new Date(u.createdAt).toLocaleDateString('uz-UZ');
      const status = u.isActive ? '✅' : '❌';
      msg += `${i + 1}. ${status} <b>${u.name}</b>\n`;
      msg += `   📱 ${u.phone}\n`;
      msg += `   📅 ${date}\n\n`;
    });

    return sendMessage(msg);
  } catch (err) {
    return sendMessage(`❌ Xatolik: ${err.message}`);
  }
}

/**
 * Handle /stats command — show statistics
 */
async function handleStats() {
  try {
    const { User, Invitation, EventType, Template } = require('../models');

    const [userCount, invCount, eventTypeCount, templateCount] = await Promise.all([
      User.count(),
      Invitation.count(),
      EventType.count(),
      Template.count(),
    ]);

    // Get invitation breakdown by event type
    const invByType = await Invitation.findAll({
      attributes: [
        'eventTypeId',
        [require('sequelize').fn('COUNT', '*'), 'count'],
      ],
      group: ['eventTypeId'],
      include: [{ association: 'eventType', attributes: ['label'] }],
      raw: true,
    });

    // Recent invitations (last 5)
    const recentInvs = await Invitation.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['hostName', 'eventTitle', 'slug', 'createdAt', 'viewCount'],
      include: [
        { association: 'user', attributes: ['name'] },
      ],
    });

    // Total views
    const totalViews = await Invitation.sum('viewCount') || 0;

    let msg = `📊 <b>eTaklifnoma Statistika</b>\n\n`;
    msg += `👥 Foydalanuvchilar: <b>${userCount}</b>\n`;
    msg += `📨 Taklifnomalar: <b>${invCount}</b>\n`;
    msg += `👁 Umumiy ko'rishlar: <b>${totalViews}</b>\n`;
    msg += `🎨 Shablonlar: <b>${templateCount}</b>\n`;
    msg += `📋 Tadbir turlari: <b>${eventTypeCount}</b>\n`;

    if (invByType.length > 0) {
      msg += `\n📈 <b>Tadbir turlari bo'yicha:</b>\n`;
      invByType.forEach(row => {
        const label = row['eventType.label'] || 'Noma\'lum';
        msg += `  • ${label}: <b>${row.count}</b>\n`;
      });
    }

    if (recentInvs.length > 0) {
      msg += `\n🕐 <b>Oxirgi taklifnomalar:</b>\n`;
      recentInvs.forEach((inv, i) => {
        const date = new Date(inv.createdAt).toLocaleDateString('uz-UZ');
        const user = inv.user?.name || '—';
        msg += `${i + 1}. ${inv.eventTitle || inv.hostName} (${user})\n`;
        msg += `   👁 ${inv.viewCount || 0} ko'rish · ${date}\n`;
      });
    }

    return sendMessage(msg);
  } catch (err) {
    return sendMessage(`❌ Xatolik: ${err.message}`);
  }
}

/**
 * Handle /start command — welcome message
 */
async function handleStart() {
  const msg = `🎉 <b>eTaklifnoma Admin Bot</b>\n\n` +
    `Mavjud komandalar:\n\n` +
    `/users — 👥 Foydalanuvchilar ro'yxati\n` +
    `/stats — 📊 Statistika\n` +
    `/start — ℹ️ Yordam\n`;
  return sendMessage(msg);
}

/**
 * Process a single Telegram update
 */
async function processUpdate(update) {
  if (!update.message?.text) return;

  const chatId = String(update.message.chat.id);
  // Only respond to admin chat
  if (chatId !== ADMIN_CHAT_ID) return;

  const text = update.message.text.trim().toLowerCase();

  switch (text) {
    case '/start':
    case '/help':
      await handleStart();
      break;
    case '/users':
      await handleUsers();
      break;
    case '/stats':
      await handleStats();
      break;
    default:
      // Ignore other messages
      break;
  }
}

/**
 * Poll for updates from Telegram
 */
async function pollUpdates() {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.log('⚠️ Telegram bot: VERIFY_BOT_TOKEN or VERIFY_CHAT_ID not set, skipping bot');
    return;
  }

  polling = true;
  console.log('🤖 Telegram Admin Bot started (polling)');

  while (polling) {
    try {
      const result = await botApi('getUpdates', {
        offset: lastUpdateId + 1,
        timeout: 30,
        allowed_updates: ['message'],
      });

      if (result?.ok && result.result?.length > 0) {
        for (const update of result.result) {
          lastUpdateId = update.update_id;
          await processUpdate(update);
        }
      }
    } catch (err) {
      console.error('Bot polling error:', err.message);
      // Wait before retrying
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

/**
 * Stop polling
 */
function stopBot() {
  polling = false;
}

module.exports = { pollUpdates, stopBot, sendMessage };
