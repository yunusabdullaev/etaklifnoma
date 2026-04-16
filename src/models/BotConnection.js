const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  chatId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete documents after 1 hour
});

module.exports = mongoose.model('BotConnection', schema);
