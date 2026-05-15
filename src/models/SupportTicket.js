const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'answered', 'closed'],
    default: 'open',
  },
  adminReply: {
    type: String,
    default: null,
  },
  repliedAt: {
    type: Date,
    default: null,
  },
  telegramMessageId: {
    type: String,
    default: null,
    maxlength: 50,
  },
}, {
  timestamps: true,
});

SupportTicketSchema.index({ userId: 1, updatedAt: -1 });
SupportTicketSchema.index({ status: 1 });

module.exports = SupportTicketSchema;
