const {DataTypes} = require("sequelize");
const {sequelize} = require("../config/database");

const Subscriber = sequelize.define('Subscriber', {
 email:{type: DataTypes.STRING, allowNull: false, validate: {isEmail: true} },
 
},
{timestamps: true, tableName: "subscribers"})

module.exports = Subscriber;