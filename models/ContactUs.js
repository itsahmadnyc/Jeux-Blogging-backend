const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");



const ContactUs = sequelize.define('ContactUs', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectType: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

},
  {
    timestamps: true,
    tableName: 'contactUs', // change this to whatever table name you want
  }
);


module.exports = ContactUs;