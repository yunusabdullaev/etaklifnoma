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
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'", "https://www.openstreetmap.org"],
      },
    },
  })
);
app.use(cors());
app.use(morgan(appConfig.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: appConfig.rateLimit.windowMs,
    max: appConfig.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
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

    // Sync models in development (migrations are preferred in production)
    if (appConfig.nodeEnv === 'development') {
      await sequelize.sync();
      console.log('✅ Models synchronized');
    }

    app.listen(appConfig.port, () => {
      console.log(`\n🚀 Taklifnoma Service is running`);
      console.log(`   Environment : ${appConfig.nodeEnv}`);
      console.log(`   Port        : ${appConfig.port}`);
      console.log(`   URL         : ${appConfig.appUrl}`);
      console.log(`   Health      : ${appConfig.appUrl}/health\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
