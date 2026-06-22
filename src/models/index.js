'use strict';

const mongoose = require('mongoose');

const UserSchema = require('./User');
const EventTypeSchema = require('./EventType');
const TemplateSchema = require('./Template');
const InvitationSchema = require('./Invitation');
const RsvpSchema = require('./Rsvp');
const WishSchema = require('./Wish');
const SupportTicketSchema = require('./SupportTicket');
const SupportMessageSchema = require('./SupportMessage');
const BotConnectionSchema = require('./BotConnection');
const FileSchema = require('./File');

// Apply toJSON config to ALL schemas — add 'id', remove '__v'
const toJSONOpts = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
};
[
  UserSchema, EventTypeSchema, TemplateSchema, InvitationSchema,
  RsvpSchema, WishSchema, SupportTicketSchema, SupportMessageSchema,
  BotConnectionSchema, FileSchema,
].forEach(schema => {
  schema.set('toJSON', toJSONOpts);
  schema.set('toObject', toJSONOpts);
});

const db = {
  mongoose,
  User: mongoose.model('User', UserSchema),
  EventType: mongoose.model('EventType', EventTypeSchema),
  Template: mongoose.model('Template', TemplateSchema),
  Invitation: mongoose.model('Invitation', InvitationSchema),
  Rsvp: mongoose.model('Rsvp', RsvpSchema),
  Wish: mongoose.model('Wish', WishSchema),
  SupportTicket: mongoose.model('SupportTicket', SupportTicketSchema),
  SupportMessage: mongoose.model('SupportMessage', SupportMessageSchema),
  BotConnection: mongoose.model('BotConnection', BotConnectionSchema),
  File: mongoose.model('File', FileSchema),
};

module.exports = db;
