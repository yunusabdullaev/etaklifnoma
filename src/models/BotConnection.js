const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BotConnection = sequelize.define('BotConnection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    chatId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      field: 'chat_id'
    },
  }, {
    tableName: 'bot_connections',
    underscored: true,
    timestamps: true,
  });

  return BotConnection;
};
