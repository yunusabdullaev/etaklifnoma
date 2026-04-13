const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rsvp = sequelize.define('Rsvp', {
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
    guestCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'guest_count',
    },
    status: {
      // 'attending' | 'not_attending' | 'maybe'
      type: DataTypes.ENUM('attending', 'not_attending', 'maybe'),
      allowNull: false,
      defaultValue: 'attending',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  }, {
    tableName: 'rsvps',
    underscored: true,
    timestamps: true,
  });

  return Rsvp;
};
