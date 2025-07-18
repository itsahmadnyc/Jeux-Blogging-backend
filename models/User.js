const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
    validate: {
      isEmail: true,
    }
  },

  password: { type: DataTypes.STRING, allowNull: false },
  isBlocked:{ type: DataTypes.BOOLEAN, defaultValue: false},

  googleId: { type: DataTypes.STRING, unique: true },
  role: {
    type: DataTypes.ENUM("admin", "employee", "user"),
    allowNull: false,
    defaultValue: "user",
  },
  profileImage: { type: DataTypes.STRING },
  employeeId: { type: DataTypes.STRING },
},
  {
    timestamps: true,
    tableName: 'users',
  }

);

module.exports = User;
