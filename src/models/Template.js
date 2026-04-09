'use strict';

module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define('Template', {
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
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 150],
      },
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'thumbnail_url',
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
      comment: 'JSON schema defining customizable fields for the template',
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'html_content',
      comment: 'HTML template with {{placeholders}}',
    },
    cssContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'css_content',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
    },
  }, {
    tableName: 'templates',
    timestamps: true,
    underscored: true,
  });

  Template.associate = (models) => {
    Template.belongsTo(models.EventType, {
      foreignKey: 'event_type_id',
      as: 'eventType',
    });
    Template.hasMany(models.Invitation, {
      foreignKey: 'template_id',
      as: 'invitations',
    });
  };

  return Template;
};
