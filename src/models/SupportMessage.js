const mongoose = require('mongoose');

const SupportMessageSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket',
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

SupportMessageSchema.index({ ticketId: 1, createdAt: 1 });

module.exports = SupportMessageSchema;
