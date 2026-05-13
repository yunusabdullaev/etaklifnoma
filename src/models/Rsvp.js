const mongoose = require('mongoose');

const RsvpSchema = new mongoose.Schema({
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
  guestCount: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['attending', 'not_attending', 'maybe'],
    default: 'attending',
    required: true,
  },
  message: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
    maxlength: 20,
  },
}, {
  timestamps: true,
});

module.exports = RsvpSchema;
