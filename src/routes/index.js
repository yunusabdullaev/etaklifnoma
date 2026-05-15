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

// ── Map URL Resolver (short URLs → full URL with coords) ────
router.get('/api/resolve-map', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ success: false, resolved: url });
  try {
    // Try HEAD first, fallback to GET (some servers don't redirect on HEAD)
    let resolved = url;
    for (const method of ['HEAD', 'GET']) {
      try {
        const response = await fetch(url, {
          method,
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; etaklifnoma/1.0)' },
          signal: AbortSignal.timeout(6000),
        });
        if (response.url && response.url !== url) {
          resolved = response.url;
          break;
        }
      } catch(e) { if (method === 'GET') throw e; }
    }

    // Build embed URL from resolved coordinates
    let mapEmbedUrl = null;
    try {
      const u = new URL(resolved);

      // ── Yandex: poi[point]=lon,lat ──
      const poi = u.searchParams.get('poi[point]');
      if (poi) {
        const [lon, lat] = poi.split(',');
        if (lon && lat) {
          mapEmbedUrl = `https://yandex.uz/map-widget/v1/?ll=${lon},${lat}&pt=${lon},${lat},pm2rdm&z=16`;
        }
      }
      // ── Yandex: pt=lon,lat,style ──
      if (!mapEmbedUrl) {
        const pt = u.searchParams.get('pt');
        if (pt) {
          const [lon, lat] = pt.split(',');
          if (lon && lat) mapEmbedUrl = `https://yandex.uz/map-widget/v1/?ll=${lon},${lat}&pt=${pt}&z=16`;
        }
      }
      // ── Yandex: ll=lon,lat ──
      if (!mapEmbedUrl) {
        const ll = u.searchParams.get('ll');
        if (ll) {
          const z = u.searchParams.get('z') || '15';
          mapEmbedUrl = `https://yandex.uz/map-widget/v1/?ll=${ll}&z=${z}`;
        }
      }
      // ── Google Maps: /@lat,lng or ?q=lat,lng ──
      if (!mapEmbedUrl && u.hostname.includes('google.com')) {
        const coordMatch = resolved.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          const lat = coordMatch[1], lng = coordMatch[2];
          mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
        } else {
          const q = u.searchParams.get('q');
          if (q) mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
        }
      }
    } catch(e) {}

    return res.json({ success: true, resolved, mapEmbedUrl });
  } catch (err) {
    return res.json({ success: false, resolved: url, mapEmbedUrl: null, error: err.message });
  }
});

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
  const chatId = String(req.body.chatId || '').trim();
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

  console.log('[bot/test] chatId:', chatId, '| hasToken:', !!botToken);

  if (!botToken) {
    return res.json({ success: false, message: 'Server da TELEGRAM_BOT_TOKEN sozlanmagan.' });
  }
  if (!chatId || !/^-?\d+$/.test(chatId)) {
    return res.json({ success: false, message: 'Chat ID raqam bo\'lishi kerak. @userinfobot dan oling.' });
  }

  try {
    const text = '\u2705 <b>eTaklifnoma ulanish tekshiruvi</b>\n\nSizning Chat ID: <code>' + chatId + '</code>\nMehmonlar tilak yuborganda shu chatga xabar keladi. \ud83c\udf89';
    const sendRes = await fetch('https://api.telegram.org/bot' + botToken + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' }),
    });
    const sendData = await sendRes.json();
    console.log('[bot/test] TG response:', JSON.stringify(sendData));

    if (!sendData.ok) {
      if (sendData.error_code === 403) {
        return res.json({ success: false, message: '\u274c Xabar yuborilib bo\'lmadi. Avval ulanayotgan botga Telegramda /start yuboring!' });
      }
      if (sendData.error_code === 400) {
        return res.json({ success: false, message: '\u274c Chat ID ' + chatId + ' topilmadi. @userinfobot dan to\'g\'ri ID ni oling.' });
      }
      return res.json({ success: false, message: 'Telegram xatosi: ' + (sendData.description || 'Unknown') });
    }

    return res.json({ success: true, message: '\u2705 Test xabar yuborildi! Telegramni tekshiring.' });
  } catch (err) {
    console.error('[bot/test] Error:', err);
    return res.json({ success: false, message: 'Tarmoq xatoligi: ' + err.message });
  }
});

// ── Telegram Bot Link Generator ──────────────────────────
router.post('/api/bot/generate-link', async (req, res) => {
  try {
    const { BotConnection } = require('../models');
    const token = 'tks_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    await BotConnection.create({ token });
    
    // Determine the bot username
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    let botUsername = 'etaklifnoma_bot';
    if (botToken) {
       try {
         const meRes = await fetch('https://api.telegram.org/bot' + botToken + '/getMe');
         const meData = await meRes.json();
         if (meData.ok) botUsername = meData.result.username;
       } catch (e) {}
    }

    res.json({ success: true, token, botUrl: `https://t.me/${botUsername}?start=${token}` });
  } catch (err) {
    res.json({ success: false, message: 'Link generatsiya qilishda xatolik' });
  }
});

router.get('/api/bot/check-link', async (req, res) => {
  try {
    const { BotConnection } = require('../models');
    const { token } = req.query;
    if (!token) return res.json({ success: false });

    const doc = await BotConnection.findOne({ token });
    if (doc && doc.chatId) {
      return res.json({ success: true, chatId: doc.chatId });
    }
    
    res.json({ success: false });
  } catch (err) {
    res.json({ success: false });
  }
});

module.exports = router;
