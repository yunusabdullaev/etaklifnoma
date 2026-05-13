const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    maxlength: 255,
  },
  mimetype: {
    type: String,
    required: true,
    maxlength: 100,
  },
  data: {
    type: Buffer,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

module.exports = FileSchema;
