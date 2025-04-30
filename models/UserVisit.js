const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");


const UserVisit = sequelize.define("UserVisit", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id'
        }
      },
      visitedAt: {
       type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,   //SET AS DEFAULT CURRENT TIMESTAMP
       allowNull: false
      }
})


module.exports = UserVisit;
