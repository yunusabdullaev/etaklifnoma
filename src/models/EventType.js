const mongoose = require('mongoose');

const EventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    enum: ['wedding', 'birthday', 'jubilee', 'graduation', 'custom'],
    maxlength: 50,
  },
  label: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
    maxlength: 50,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = EventTypeSchema;
