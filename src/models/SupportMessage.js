const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SupportMessage = sequelize.define('SupportMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ticketId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ticket_id',
    },
    sender: {
      // 'user' = client, 'admin' = support team
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'support_messages',
    underscored: true,
    timestamps: true,
  });

  SupportMessage.associate = (models) => {
    SupportMessage.belongsTo(models.SupportTicket, {
      foreignKey: 'ticket_id',
      as: 'ticket',
    });
  };

  return SupportMessage;
};
