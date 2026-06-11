const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const appConfig = require('../config/app');

const generateSlug = customAlphabet(appConfig.slug.alphabet, appConfig.slug.length);

const InvitationSchema = new mongoose.Schema({
  eventTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType',
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
  },

  // Core fields
  hostName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
  },
  guestName: {
    type: String,
    default: null,
    maxlength: 200,
  },
  eventTitle: {
    type: String,
    default: null,
    maxlength: 300,
  },
  eventDate: {
    type: String, // stored as YYYY-MM-DD string
    required: true,
  },
  eventTime: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    required: true,
    maxlength: 500,
  },
  locationUrl: {
    type: String,
    default: null,
    maxlength: 1000,
  },
  message: {
    type: String,
    default: null,
  },

  // Extra JSON data
  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // Meta
  viewCount: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes — critical for performance
InvitationSchema.index({ userId: 1, createdAt: -1 });
InvitationSchema.index({ eventTypeId: 1 });
InvitationSchema.index({ isPublished: 1, slug: 1 });
InvitationSchema.index({ eventDate: 1 }); // For cleanup job

// Pre-save hook: auto-generate unique slug
InvitationSchema.pre('validate', async function () {
  if (!this.slug) {
    let slug;
    let exists = true;
    const Invitation = mongoose.model('Invitation');
    while (exists) {
      slug = generateSlug();
      const found = await Invitation.findOne({ slug });
      exists = !!found;
    }
    this.slug = slug;
  }
});

module.exports = InvitationSchema;
