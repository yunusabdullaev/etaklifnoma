require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taklifnoma';

// ── Global plugin: add `id` string field to all documents ──
// This ensures frontend code using `.id` works seamlessly with MongoDB `_id`
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

async function connectDB() {
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ MongoDB connected:', mongoose.connection.host);
}

module.exports = { connectDB, mongoose };
