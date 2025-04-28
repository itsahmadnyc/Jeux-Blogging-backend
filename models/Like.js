const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Like = sequelize.define('Like', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blogs',
            key: 'id'
        }
    }
},
    {
        timestamps: true,
        tableName: 'likes',
    },
)


module.exports = Like;