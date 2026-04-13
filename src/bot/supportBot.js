/**
 * Telegram Support Bot
 *
 * Listens for admin replies to support tickets.
 * Commands:
 *   /reply <ticket_id> <message> — Reply to a support ticket
 *   /tickets — List open tickets
 *   /close <ticket_id> — Close a ticket
 */

const SUPPORT_BOT_TOKEN = process.env.SUPPORT_BOT_TOKEN || '';
const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID || '';

let lastUpdateId = 0;
let polling = false;

async function botApi(method, body = {}) {
  if (!SUPPORT_BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${SUPPORT_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error(`Support Bot API error (${method}):`, err.message);
    return null;
  }
}

async function sendMessage(text) {
  return botApi('sendMessage', {
    chat_id: SUPPORT_CHAT_ID,
    text,
    parse_mode: 'HTML',
  });
}

/**
 * /reply <ticket_short_id> <message>
 */
async function handleReply(text) {
  const match = text.match(/^\/reply\s+(\S+)\s+(.+)$/s);
  if (!match) {
    return sendMessage('❌ Format: /reply <ticket_id> <javob matni>');
  }

  const shortId = match[1];
  const replyText = match[2].trim();

  try {
    const { SupportTicket, SupportMessage } = require('../models');
    const { sequelize } = require('../models');

    // Find ticket by short ID prefix (cast UUID to text for LIKE)
    const ticket = await SupportTicket.findOne({
      where: sequelize.where(
        sequelize.cast(sequelize.col('SupportTicket.id'), 'text'),
        { [require('sequelize').Op.like]: `${shortId}%` }
      ),
      include: [{ association: 'user', attributes: ['name', 'phone'] }],
    });

    if (!ticket) {
      return sendMessage(`❌ Ticket "${shortId}" topilmadi`);
    }

    // Create admin reply as chat message
    await SupportMessage.create({
      ticketId: ticket.id,
      sender: 'admin',
      text: replyText,
    });

    // Update ticket status
    await ticket.update({
      adminReply: replyText,
      status: 'answered',
      repliedAt: new Date(),
    });

    const msg = `✅ <b>Javob yuborildi!</b>\n\n` +
      `📋 Ticket: #${ticket.id.slice(0, 8)}\n` +
      `👤 ${ticket.user?.name || '—'} (${ticket.user?.phone || '—'})\n` +
      `💬 ${replyText}`;

    return sendMessage(msg);
  } catch (err) {
    return sendMessage(`❌ Xatolik: ${err.message}`);
  }
}

/**
 * /tickets — list open tickets
 */
async function handleTickets() {
  try {
    const { SupportTicket } = require('../models');

    const tickets = await SupportTicket.findAll({
      where: { status: 'open' },
      order: [['created_at', 'DESC']],
      limit: 20,
      include: [{ association: 'user', attributes: ['name', 'phone'] }],
    });

    if (tickets.length === 0) {
      return sendMessage('✅ Ochiq murojaatlar yo\'q!');
    }

    let msg = `📬 <b>Ochiq murojaatlar</b> (${tickets.length} ta)\n\n`;

    tickets.forEach((t, i) => {
      const date = new Date(t.createdAt).toLocaleDateString('uz-UZ');
      msg += `${i + 1}. <b>#${t.id.slice(0, 8)}</b> — ${t.subject}\n`;
      msg += `   👤 ${t.user?.name || '—'} · ${date}\n`;
      msg += `   💬 ${t.message.slice(0, 80)}${t.message.length > 80 ? '...' : ''}\n\n`;
    });

    msg += `📝 Javob: /reply <id> <matn>`;
    return sendMessage(msg);
  } catch (err) {
    return sendMessage(`❌ Xatolik: ${err.message}`);
  }
}

/**
 * /close <ticket_id>
 */
async function handleClose(text) {
  const match = text.match(/^\/close\s+(\S+)/);
  if (!match) {
    return sendMessage('❌ Format: /close <ticket_id>');
  }

  try {
    const { SupportTicket } = require('../models');
    const { sequelize } = require('../models');

    const ticket = await SupportTicket.findOne({
      where: sequelize.where(
        sequelize.cast(sequelize.col('SupportTicket.id'), 'text'),
        { [require('sequelize').Op.like]: `${match[1]}%` }
      ),
    });

    if (!ticket) {
      return sendMessage(`❌ Ticket "${match[1]}" topilmadi`);
    }

    await ticket.update({ status: 'closed' });
    return sendMessage(`✅ Ticket #${ticket.id.slice(0, 8)} yopildi`);
  } catch (err) {
    return sendMessage(`❌ Xatolik: ${err.message}`);
  }
}

/**
 * /start
 */
async function handleStart() {
  const msg = `🛟 <b>eTaklifnoma Support Bot</b>\n\n` +
    `Komandalar:\n\n` +
    `/tickets — 📬 Ochiq murojaatlar\n` +
    `/reply &lt;id&gt; &lt;javob&gt; — ✍️ Javob berish\n` +
    `/close &lt;id&gt; — ✅ Yopish\n`;
  return sendMessage(msg);
}

async function processUpdate(update) {
  if (!update.message?.text) return;
  const chatId = String(update.message.chat.id);
  if (chatId !== SUPPORT_CHAT_ID) return;

  const text = update.message.text.trim();
  const cmd = text.split(' ')[0].toLowerCase();

  switch (cmd) {
    case '/start':
    case '/help':
      await handleStart();
      break;
    case '/tickets':
      await handleTickets();
      break;
    case '/reply':
      await handleReply(text);
      break;
    case '/close':
      await handleClose(text);
      break;
  }
}

async function pollUpdates() {
  if (!SUPPORT_BOT_TOKEN || !SUPPORT_CHAT_ID) {
    console.log('⚠️ Support bot: SUPPORT_BOT_TOKEN or SUPPORT_CHAT_ID not set, skipping');
    return;
  }

  polling = true;
  console.log('🛟 Support Bot started (polling)');

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
      console.error('Support bot polling error:', err.message);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

function stopBot() { polling = false; }

module.exports = { pollUpdates, stopBot };
