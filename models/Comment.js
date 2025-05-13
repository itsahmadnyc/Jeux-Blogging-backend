const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:
            { model: 'users', key: 'id' }
    },

    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blogs', key: 'id'
        }
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,     // ALLOW TOP LEVEL COMMENTS
        hierarchy: true,
        references: {
            model: 'comments', key: 'id'
        }
    },
    
    // content: { type: DataTypes.STRING },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    }
},
    { tableName: 'comments', timestamps: true },
)


module.exports = Comment;