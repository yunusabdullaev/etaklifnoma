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

// Indexes
TemplateSchema.index({ slug: 1 }, { unique: true });
TemplateSchema.index({ eventTypeId: 1, isActive: 1, sortOrder: 1 });
TemplateSchema.index({ isActive: 1, isPremium: 1 });

module.exports = TemplateSchema;
