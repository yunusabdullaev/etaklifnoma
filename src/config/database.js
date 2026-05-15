require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taklifnoma';

// ── Global plugin: expose `id` alongside `_id` in all documents ──────────────
mongoose.plugin((schema) => {
  schema.set('toJSON', {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      return ret;
    },
  });
  schema.set('toObject', {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      return ret;
    },
  });
});

// ── Connection event listeners ────────────────────────────────────────────────
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected — attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// ── Connect ───────────────────────────────────────────────────────────────────
async function connectDB() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,           // max 10 concurrent connections
    minPoolSize: 2,            // keep 2 connections open always
    connectTimeoutMS: 10000,
  });
  console.log(`✅ MongoDB connected: ${mongoose.connection.host} (${mongoose.connection.name})`);
}

module.exports = { connectDB, mongoose };
