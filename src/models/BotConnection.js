const mongoose = require('mongoose');

const BotConnectionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  chatId: {
    type: String,
    default: null,
    maxlength: 50,
  },
}, {
  timestamps: true,
});

module.exports = BotConnectionSchema;
