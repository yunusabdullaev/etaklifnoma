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
  if (!bot || !String(bot).includes(':')) {
    return res.json({ success: false, message: 'Format noto\'g\'ri. BOT_TOKEN:CHAT_ID ko\'rinishida kiriting.' });
  }
  const botStr = String(bot).trim();
  const lastColon = botStr.lastIndexOf(':');
  const botToken = botStr.substring(0, lastColon).trim();
  const chatId   = botStr.substring(lastColon + 1).trim();

  if (!botToken || !chatId) {
    return res.json({ success: false, message: 'Bot token yoki Chat ID topilmadi.' });
  }

  try {
    // 1. Validate token via getMe
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meData = await meRes.json();
    if (!meData.ok) {
      return res.json({ success: false, message: `Bot token noto'g'ri: ${meData.description}` });
    }
    const botName = meData.result.first_name || meData.result.username;

    // 2. Send a real test message
    const text = `✅ <b>eTaklifnoma ulanish tekshiruvi</b>\n\nBotingiz <b>${botName}</b> muvaffaqiyatli ulandi!\n\nEndi mehmonlar tilak yuborganda shu chatga xabar keladi. 🎉`;
    const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const sendData = await sendRes.json();
    if (!sendData.ok) {
      // Common errors explained in Uzbek
      let msg = sendData.description || 'Xabar yuborib bo\'lmadi.';
      if (sendData.error_code === 403) {
        msg = '❌ Bot chat ga xabar yubora olmaydi. Avval botingizga /start yuboring yoki botni guruhga admin sifatida qo\'shing!';
      } else if (sendData.error_code === 400 && msg.includes('chat not found')) {
        msg = '❌ Chat topilmadi. Chat ID noto\'g\'ri. @userinfobot dan to\'g\'ri ID ni oling.';
      } else if (sendData.error_code === 400 && msg.includes('chat_id')) {
        msg = '❌ Chat ID noto\'g\'ri format. Faqat raqam bo\'lishi kerak (masalan: 123456789 yoki -1001234567890).';
      }
      return res.json({ success: false, message: msg, botName });
    }

    return res.json({ success: true, message: `✅ Bot muvaffaqiyatli ulandi! "${botName}" botidan test xabar yuborildi.`, botName });
  } catch (err) {
    return res.json({ success: false, message: `Server xatoligi: ${err.message}` });
  }
});

module.exports = router;
