const { Router } = require('express');
const eventTypeRoutes = require('./eventTypeRoutes');
const templateRoutes = require('./templateRoutes');
const invitationRoutes = require('./invitationRoutes');
const invitationController = require('../controllers/invitationController');
const renderController = require('../controllers/renderController');
const wishesController = require('../controllers/wishesController');
const authController = require('../controllers/authController');
const validators = require('../validators');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth');

const uploadController = require('../controllers/uploadController');

const router = Router();

// ── Auth routes ─────────────────────────────────────────
router.post('/api/auth/register', authController.register);
router.post('/api/auth/verify', authController.verify);
router.post('/api/auth/login', authController.login);
router.get('/api/auth/me', protect, authController.me);

// ── API routes ──────────────────────────────────────────
router.use('/api/event-types', eventTypeRoutes);
router.use('/api/templates', templateRoutes);
router.use('/api/invitations', optionalAuth, invitationRoutes);

// ── Upload endpoint ─────────────────────────────────────
router.post('/api/upload/music', uploadController.uploadMusic);

// ── Preview endpoint (no auth, POST) ────────────────────
router.post('/api/preview', renderController.preview);
router.post('/api/preview/full', renderController.fullPreview);

// ── Wishes endpoint (Telegram bot) ──────────────────────
router.post('/api/wishes', wishesController.send);
router.get('/api/wishes/:slug', protect, wishesController.getBySlug);

// ── File upload/serve ───────────────────────────────────
const fileController = require('../controllers/fileController');
router.post('/api/upload', fileController.uploadMiddleware, fileController.upload);
router.get('/api/files/:id', fileController.serve);

// ── Support ticket endpoints ────────────────────────────
const supportController = require('../controllers/supportController');
router.post('/api/support', protect, supportController.createTicket);
router.get('/api/support', protect, supportController.getMyTickets);
router.get('/api/support/:id', protect, supportController.getTicket);
router.post('/api/support/:id/messages', protect, supportController.addMessage);

// ── QR Code endpoint ────────────────────────────────────
router.get('/api/invitations/:slug/qr', (req, res) => {
  const appConfig = require('../config/app');
  const url = `${appConfig.appUrl}/invite/${req.params.slug}/view`;
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}&color=1a1e38&bgcolor=ffffff`;
  res.json({ success: true, data: { url, qrCode } });
});

// ── RSVP endpoints ──────────────────────────────────────
const rsvpController = require('../controllers/rsvpController');
router.post('/api/invitations/:slug/rsvp', rsvpController.submitRsvp);
router.get('/api/invitations/:slug/rsvp', protect, rsvpController.getRsvps);

// ── Render endpoints ────────────────────────────────────
router.get(
  '/api/invitations/:id/render',
  validators.getById,
  validate,
  renderController.renderById,
);

// ── Public routes ───────────────────────────────────────
// JSON data (for API consumers)
router.get(
  '/invite/:slug',
  validators.getBySlug,
  validate,
  invitationController.getBySlug,
);

// Rendered HTML page (for browsers)
router.get(
  '/invite/:slug/view',
  validators.getBySlug,
  validate,
  renderController.renderBySlug,
);

// ── Health check ────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Telegram Bot Test endpoint ──────────────────────────
router.post('/api/bot/test', async (req, res) => {
  const { bot } = req.body;
  console.log('[bot/test] Raw input:', JSON.stringify(bot));

  if (!bot || typeof bot !== 'string' || !bot.includes(':')) {
    return res.json({ success: false, message: "Format noto'g'ri. BOT_TOKEN:CHAT_ID ko'rinishida kiriting." });
  }

  const botStr = bot.trim();
  const lastColon = botStr.lastIndexOf(':');
  const botToken = botStr.substring(0, lastColon).trim();
  const chatId = botStr.substring(lastColon + 1).trim();

  console.log('[bot/test] Parsed token length:', botToken.length, '| chatId:', chatId);

  if (!botToken || botToken.length < 10) {
    return res.json({ success: false, message: "Bot token juda qisqa. @BotFather dan to'liq tokenni nusxalab oling." });
  }
  if (!chatId || !/^-?\d+$/.test(chatId)) {
    return res.json({ success: false, message: 'Chat ID noto\'g\'ri: "' + chatId + '". Faqat raqam bo\'lishi kerak. @userinfobot dan oling.' });
  }

  try {
    // 1. Validate token via getMe
    const meUrl = 'https://api.telegram.org/bot' + botToken + '/getMe';
    console.log('[bot/test] Calling getMe...');
    const meRes = await fetch(meUrl);
    const meData = await meRes.json();
    console.log('[bot/test] getMe response:', JSON.stringify(meData));

    if (!meData.ok) {
      const preview = botToken.substring(0, 10) + '...' + botToken.substring(botToken.length - 5);
      return res.json({
        success: false,
        message: 'Bot token ishlamayapti (' + preview + '). @BotFather ga /mybots yozing, tokenni qayta oling. Telegram javobi: ' + (meData.description || 'Unknown error'),
      });
    }
    const botName = meData.result.first_name || meData.result.username;
    console.log('[bot/test] Bot validated:', botName);

    // 2. Send a real test message
    const text = '\u2705 <b>eTaklifnoma ulanish tekshiruvi</b>\n\nBotingiz <b>' + botName + '</b> muvaffaqiyatli ulandi!\n\nMehmonlar tilak yuborganda shu chatga xabar keladi. \ud83c\udf89';
    console.log('[bot/test] Sending test message to chatId:', chatId);
    const sendRes = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' }),
    });
    const sendData = await sendRes.json();
    console.log('[bot/test] sendMessage response:', JSON.stringify(sendData));

    if (!sendData.ok) {
      let msg = sendData.description || 'Xabar yuborib bo\'lmadi.';
      if (sendData.error_code === 403) {
        msg = '\u274c Bot xabar yubora olmaydi. Telegramda botingizni oching va /start bosing! Guruh bo\'lsa \u2014 botni admin qiling.';
      } else if (sendData.error_code === 400 && msg.toLowerCase().includes('not found')) {
        msg = '\u274c Chat ID ' + chatId + ' topilmadi. @userinfobot ga /start yuboring va to\'g\'ri ID ni kiriting.';
      }
      return res.json({ success: false, message: msg, botName: botName });
    }

    return res.json({
      success: true,
      message: '\u2705 "' + botName + '" botidan test xabar yuborildi! Telegramni tekshiring.',
      botName: botName,
    });
  } catch (err) {
    console.error('[bot/test] Error:', err);
    return res.json({ success: false, message: 'Tarmoq xatoligi: ' + err.message });
  }
});

module.exports = router;
