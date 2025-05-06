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
    },
  {tableName: 'contactus', timestamps: 'true'} );
  
  
    module.exports = ContactUs;