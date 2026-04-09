const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
  });

  // Instance method: check password
  User.prototype.checkPassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  // Class method: hash password
  User.hashPassword = async function (password) {
    return bcrypt.hash(password, 12);
  };

  // Hide password from JSON
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.passwordHash;
    delete values.password_hash;
    return values;
  };

  return User;
};
