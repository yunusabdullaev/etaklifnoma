const mongoose = require('mongoose');

const WishSchema = new mongoose.Schema({
  invitationSlug: {
    type: String,
    required: true,
    maxlength: 30,
  },
  guestName: {
    type: String,
    required: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

WishSchema.index({ invitationSlug: 1, createdAt: -1 });

module.exports = WishSchema;
