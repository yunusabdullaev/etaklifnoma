const BotConnection = require('../models/BotConnection');

let isPolling = false;
let lastUpdateId = 0;

function startBotPolling() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('[Bot Polling] TELEGRAM_BOT_TOKEN topilmadi, xizmat ishga tushmaydi.');
    return;
  }
  if (isPolling) return;
  isPolling = true;

  console.log('🤖 Platform Bot Polling started');
  poll(token);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), options.timeout || 40000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function poll(token) {
  try {
    const res = await fetchWithTimeout(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          
          const msg = update.message;
          if (!msg || !msg.text) continue;

          // /start tks_ABC123
          if (msg.text.startsWith('/start tks_')) {
            const rawToken = msg.text.split(' ')[1]; // "tks_ABC123"
            if (rawToken) {
              const chatId = String(msg.chat.id);
              // Baza
              const doc = await BotConnection.findOneAndUpdate(
                { token: rawToken, chatId: null },
                { $set: { chatId } },
                { new: true }
              );

              if (doc) {
                const botNameRes = await fetchWithTimeout(`https://api.telegram.org/bot${token}/getMe`);
                const botData = await botNameRes.json();
                const botName = botData.ok ? (botData.result.first_name || 'Bot') : 'Bot';

                const reply = `✅ <b>eTaklifnoma muvaffaqiyatli ulandi!</b>\n\nSizning ushbu chat orqali mehmonlarning manzillarini va tilaklarini qabul qilasiz.\n\nSaytdan <i>Saqlash</i> tugmasini bosib davom etishingiz mumkin!\n\n<i>${botName}</i>`;
                
                await fetchWithTimeout(`https://api.telegram.org/bot${token}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML' })
                });
                console.log(`[Platform Bot] Linked: ${rawToken} -> ${chatId}`);
              } else {
                await fetchWithTimeout(`https://api.telegram.org/bot${token}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: msg.chat.id, text: "❌ Kechirasiz, bu kod eskirgan yoki noto'g'ri. Iltimos saytdan yangi kod oling." })
                });
              }
            }
          }
        }
      }
    }
  } catch (err) {
    if (err.name !== 'AbortError' && err.code !== 'ECONNRESET' && !err.message.includes('fetch')) {
      console.error('[Platform Bot] Tarmoq xatosi:', err.message);
    }
  }

  if (isPolling) {
    setTimeout(() => poll(token), 1000);
  }
}

module.exports = { startBotPolling };
