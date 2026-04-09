'use strict';

const { customAlphabet } = require('nanoid');
const appConfig = require('../config/app');

const generateSlug = customAlphabet(appConfig.slug.alphabet, appConfig.slug.length);

module.exports = (sequelize, DataTypes) => {
  const Invitation = sequelize.define('Invitation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'event_type_id',
    },
    templateId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'template_id',
    },
    slug: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    // ── Core invitation fields ──────────────────────────
    hostName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'host_name',
      validate: {
        notEmpty: true,
        len: [2, 200],
      },
    },
    guestName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'guest_name',
      comment: 'Optional — for personalised invitations',
    },
    eventTitle: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'event_title',
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'event_date',
      validate: {
        isDate: true,
      },
    },
    eventTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'event_time',
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    locationUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: 'location_url',
      validate: {
        isUrl: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Custom message from the host',
    },

    // ── Extra customizable data ─────────────────────────
    customFields: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: 'custom_fields',
      comment: 'Freeform key-value pairs for template-specific data',
    },

    // ── Meta ────────────────────────────────────────────
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_published',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
    },
  }, {
    tableName: 'invitations',
    timestamps: true,
    underscored: true,
  });

  // ── Hooks ──────────────────────────────────────────────
  Invitation.beforeValidate(async (invitation) => {
    if (!invitation.slug) {
      let slug;
      let exists = true;
      // Ensure uniqueness
      while (exists) {
        slug = generateSlug();
        const found = await Invitation.findOne({ where: { slug } });
        exists = !!found;
      }
      invitation.slug = slug;
    }
  });

  // ── Associations ───────────────────────────────────────
  Invitation.associate = (models) => {
    Invitation.belongsTo(models.EventType, {
      foreignKey: 'event_type_id',
      as: 'eventType',
    });
    Invitation.belongsTo(models.Template, {
      foreignKey: 'template_id',
      as: 'template',
    });
  };

  return Invitation;
};
