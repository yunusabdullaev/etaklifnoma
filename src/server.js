const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const appConfig = require('./config/app');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const { sequelize } = require('./models');

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

// Rate limiting disabled — Render provides DDoS protection at infrastructure level
// Uncomment below to re-enable if needed:
// app.use(rateLimit({ windowMs: 15*60*1000, max: 1000 }));

// ── Routes ───────────────────────────────────────────────
app.use(routes);

// ── Static files + SPA fallback (production) ────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const publicDir = path.join(__dirname, '..', 'public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));
app.use(express.static(clientDist));

// SPA fallback — serve index.html for all non-API, non-invite routes
app.get('*', (req, res, next) => {
  // Don't intercept API or invite routes (handled by Express routes above)
  if (req.path.startsWith('/api/') || req.path.startsWith('/invite/') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── 404 handler (only for API/invite routes not found) ───
app.use((_req, _res, next) => {
  next(AppError.notFound('Route not found'));
});

// ── Error handler ────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────
const start = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (create tables if not exist)
    await sequelize.sync();
    console.log('✅ Models synchronized');

    // Auto-seed event types and templates if empty
    try {
      const { EventType } = require('./models');
      const count = await EventType.count();
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
      const { Invitation, User } = require('./models');
      const orphanCount = await Invitation.count({ where: { userId: null } });
      if (orphanCount > 0) {
        const firstUser = await User.findOne({ order: [['created_at', 'ASC']] });
        if (firstUser) {
          await Invitation.update(
            { userId: firstUser.id },
            { where: { userId: null } },
          );
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

      // Start cleanup scheduler — deletes invitations 4h after event
      const { startCleanupScheduler } = require('./jobs/cleanupExpired');
      startCleanupScheduler();

      // Start Telegram admin bot (background polling)
      const { pollUpdates } = require('./bot/adminBot');
      pollUpdates();

      // Start Telegram support bot (background polling)
      const { pollUpdates: pollSupport } = require('./bot/supportBot');
      pollSupport();

      // Start Platform linking bot
      const { startBotPolling } = require('./services/botPolling');
      startBotPolling();

      // Keep-alive ping — prevent Render free tier from sleeping
      if (appConfig.nodeEnv === 'production') {
        const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
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
