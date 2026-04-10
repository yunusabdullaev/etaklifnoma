require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',

  // Supported event types — single source of truth
  eventTypes: ['wedding', 'birthday', 'jubilee', 'graduation'],

  // Slug generation settings
  slug: {
    length: 10,
    alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,                  // requests per window
  },
};
