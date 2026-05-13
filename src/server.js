const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const appConfig = require('./config/app');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// ── Express app ──────────────────────────────────────────
const app = express();

// ── Global middleware ────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(morgan(appConfig.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── Routes ───────────────────────────────────────────────
app.use(routes);

// ── Static files + SPA fallback (production) ────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));
app.use(express.static(clientDist));

// SPA fallback — serve index.html for all non-API, non-invite routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/invite/') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── 404 handler ──────────────────────────────────────────
app.use((_req, _res, next) => {
  next(AppError.notFound('Route not found'));
});

// ── Error handler ────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Load models (needed before seeding)
    const db = require('./models');

    // Auto-seed event types and templates if empty
    try {
      const count = await db.EventType.countDocuments();
      if (count === 0) {
        console.log('📦 Seeding event types and templates...');
        const seedFn = require('./database/update-templates');
        await seedFn();
      }
    } catch (seedErr) {
      console.warn('⚠️ Seed check failed:', seedErr.message);
    }

    // Fix orphaned invitations (userId = null) — assign to first user
    try {
      const orphanCount = await db.Invitation.countDocuments({ userId: null });
      if (orphanCount > 0) {
        const firstUser = await db.User.findOne().sort({ createdAt: 1 });
        if (firstUser) {
          await db.Invitation.updateMany({ userId: null }, { userId: firstUser._id });
          console.log(`🔧 Fixed ${orphanCount} orphaned invitations → assigned to ${firstUser.name}`);
        }
      }
    } catch (fixErr) {
      console.warn('⚠️ Orphan fix skipped:', fixErr.message);
    }

    app.listen(appConfig.port, () => {
      console.log(`\n🚀 Taklifnoma Service is running`);
      console.log(`   Environment : ${appConfig.nodeEnv}`);
      console.log(`   Port        : ${appConfig.port}`);
      console.log(`   URL         : ${appConfig.appUrl}`);
      console.log(`   Health      : ${appConfig.appUrl}/health\n`);

      // Start cleanup scheduler
      const { startCleanupScheduler } = require('./jobs/cleanupExpired');
      startCleanupScheduler();

      // Start Telegram admin bot
      const { pollUpdates } = require('./bot/adminBot');
      pollUpdates();

      // Start Telegram support bot
      const { pollUpdates: pollSupport } = require('./bot/supportBot');
      pollSupport();

      // Start Platform linking bot
      const { startBotPolling } = require('./services/botPolling');
      startBotPolling();

      // Keep-alive ping — prevent Render free tier from sleeping
      if (appConfig.nodeEnv === 'production') {
        const PING_INTERVAL = 14 * 60 * 1000;
        setInterval(() => {
          fetch(`${appConfig.appUrl}/health`)
            .then(() => console.log('🏓 Keep-alive ping sent'))
            .catch(() => {});
        }, PING_INTERVAL);
        console.log('🏓 Keep-alive ping enabled (every 14 min)');
      }
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
