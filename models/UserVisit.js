const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


const UserVisit = sequelize.define("UserVisit", {

  visitedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,   //SET AS DEFAULT CURRENT TIMESTAMP
    allowNull: false
  },

  visitorId: {
    type: DataTypes.STRING, // GENERATE UNIQUE ID FRONTEND
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING, 
    allowNull: true
  },
  


})


module.exports = UserVisit;
