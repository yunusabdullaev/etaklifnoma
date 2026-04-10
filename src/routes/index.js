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

module.exports = router;
