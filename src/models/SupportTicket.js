const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupportTicket = sequelize.define('SupportTicket', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'answered', 'closed'),
      defaultValue: 'open',
    },
    adminReply: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_reply',
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'replied_at',
    },
    telegramMessageId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'telegram_message_id',
    },
  }, {
    tableName: 'support_tickets',
    underscored: true,
    timestamps: true,
  });

  SupportTicket.associate = (models) => {
    SupportTicket.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    SupportTicket.hasMany(models.SupportMessage, {
      foreignKey: 'ticket_id',
      as: 'messages',
    });
  };

  return SupportTicket;
};
