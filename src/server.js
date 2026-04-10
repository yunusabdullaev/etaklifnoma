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
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        mediaSrc: ["'self'", "https:", "http:"],
        connectSrc: ["'self'", "https://api.telegram.org"],
        frameSrc: ["'self'", "https://www.openstreetmap.org"],
      },
    },
  })
);
app.use(cors());
app.use(morgan(appConfig.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting — skip for static assets and invitation view pages
app.use(
  rateLimit({
    windowMs: appConfig.rateLimit.windowMs,
    max: appConfig.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Don't rate-limit static files or invitation viewing
      if (req.path.startsWith('/assets') || req.path.startsWith('/favicon')) return true;
      if (req.path.includes('/view')) return true;
      if (req.path.startsWith('/api/preview')) return true;
      if (req.method === 'GET' && req.path.startsWith('/api/templates')) return true;
      if (req.method === 'GET' && req.path.startsWith('/api/event-types')) return true;
      return false;
    },
    message: {
      success: false,
      error: { message: 'Too many requests. Please try again later.' },
    },
  }),
);

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

    app.listen(appConfig.port, () => {
      console.log(`\n🚀 Taklifnoma Service is running`);
      console.log(`   Environment : ${appConfig.nodeEnv}`);
      console.log(`   Port        : ${appConfig.port}`);
      console.log(`   URL         : ${appConfig.appUrl}`);
      console.log(`   Health      : ${appConfig.appUrl}/health\n`);

      // Start cleanup scheduler — deletes invitations 4h after event
      const { startCleanupScheduler } = require('./jobs/cleanupExpired');
      startCleanupScheduler();
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
