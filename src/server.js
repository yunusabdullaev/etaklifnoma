const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const compression = require('compression');

const appConfig = require('./config/app');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

// ── Express app ──────────────────────────────────────────
const app = express();

// ── Trust Render's proxy ─────────────────────────────────
app.set('trust proxy', 1);

// ── Security & parsing middleware ─────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

app.use(cors({
  origin: [
    'https://etaklifnoma.uz',
    'https://www.etaklifnoma.uz',
    ...(appConfig.nodeEnv === 'development' ? ['http://localhost:5173', 'http://localhost:3000'] : []),
  ],
  credentials: true,
}));

// ── Rate limiting ─────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, error: { message: 'Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  message: { success: false, error: { message: 'So\'rovlar juda ko\'p. Biroz kutib turing.' } },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ── Logging ───────────────────────────────────────────────
if (appConfig.nodeEnv !== 'test') {
  app.use(morgan(appConfig.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── Routes ────────────────────────────────────────────────
app.use(routes);

// ── Static files + SPA fallback ───────────────────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const publicDir = path.join(__dirname, '..', 'public');

app.use('/uploads', express.static(path.join(publicDir, 'uploads'), {
  maxAge: '30d',
  immutable: true,
}));

// Serve Vite assets with maximum cache age since they are fingerprinted
app.use('/assets', express.static(path.join(clientDist, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Serve other files in dist (like favicon, etc.) with lower cache age
app.use(express.static(clientDist, {
  maxAge: '1h',
  etag: true,
}));

// SPA fallback
app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api/') ||
    req.path.startsWith('/invite/') ||
    req.path === '/health'
  ) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ── 404 ──────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(AppError.notFound('Route not found'));
});

// ── Error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────
let httpServer;

const start = async () => {
  try {
    await connectDB();

    // Load models (ensures indexes are created)
    require('./models');

    // Auto-seed event types and templates if empty
    try {
      const { EventType } = require('./models');
      const count = await EventType.countDocuments();
      if (count === 0) {
        console.log('📦 Seeding event types and templates...');
        const seedFn = require('./database/update-templates');
        await seedFn();
      }
    } catch (seedErr) {
      console.warn('⚠️ Seed check failed:', seedErr.message);
    }

    httpServer = app.listen(appConfig.port, () => {
      console.log(`\n🚀 Taklifnoma Service is running`);
      console.log(`   Environment : ${appConfig.nodeEnv}`);
      console.log(`   Port        : ${appConfig.port}`);
      console.log(`   URL         : ${appConfig.appUrl}\n`);

      // Background jobs & bots
      try {
        const { startCleanupScheduler } = require('./jobs/cleanupExpired');
        startCleanupScheduler();
      } catch (e) { console.warn('Cleanup scheduler error:', e.message); }

      try {
        const { pollUpdates } = require('./bot/adminBot');
        pollUpdates();
      } catch (e) { console.warn('AdminBot error:', e.message); }

      try {
        const { pollUpdates: pollSupport } = require('./bot/supportBot');
        pollSupport();
      } catch (e) { console.warn('SupportBot error:', e.message); }

      try {
        const { startBotPolling } = require('./services/botPolling');
        startBotPolling();
      } catch (e) { console.warn('BotPolling error:', e.message); }

      // Keep-alive ping (production only)
      if (appConfig.nodeEnv === 'production') {
        const PING_INTERVAL = 14 * 60 * 1000;
        setInterval(async () => {
          try {
            await fetch(`${appConfig.appUrl}/health`);
          } catch (_) {}
        }, PING_INTERVAL);
        console.log('🏓 Keep-alive ping enabled (every 14 min)');
      }
    });

    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${appConfig.port} band! Boshqa process ishlatmoqda. PORT env o'zgaruvchisini o'zgartiring.`);
      } else {
        console.error('❌ Server xatoligi:', err.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n🛑 ${signal} received — shutting down gracefully`);
  if (httpServer) {
    httpServer.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
    // Force exit after 10s if not closed
    setTimeout(() => {
      console.warn('⚠️ Forcing exit after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

start();

module.exports = app;
