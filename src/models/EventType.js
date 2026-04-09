'use strict';

const { eventTypes } = require('../config/app');

module.exports = (sequelize, DataTypes) => {
  const EventType = sequelize.define('EventType', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isIn: [eventTypes],
      },
      comment: 'wedding | birthday | jubilee | graduation',
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Human-readable display name',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Icon identifier or emoji',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'event_types',
    timestamps: true,
    underscored: true,
  });

  EventType.associate = (models) => {
    EventType.hasMany(models.Template, {
      foreignKey: 'event_type_id',
      as: 'templates',
    });
    EventType.hasMany(models.Invitation, {
      foreignKey: 'event_type_id',
      as: 'invitations',
    });
  };

  return EventType;
};
