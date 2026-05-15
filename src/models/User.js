const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      return ret;
    },
  },
});

// Indexes
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });

// Instance method: check password
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Static method: hash password
UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 12);
};

module.exports = UserSchema;
