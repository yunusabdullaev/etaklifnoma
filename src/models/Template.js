const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  eventTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType',
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 150,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
  },
  description: {
    type: String,
    default: null,
  },
  thumbnailUrl: {
    type: String,
    default: null,
    maxlength: 500,
  },
  structure: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  htmlContent: {
    type: String,
    default: null,
  },
  cssContent: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = TemplateSchema;
