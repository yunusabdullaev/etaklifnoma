const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Wish = sequelize.define('Wish', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invitationSlug: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'invitation_slug',
    },
    guestName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'guest_name',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'wishes',
    underscored: true,
    timestamps: true,
  });

  return Wish;
};
