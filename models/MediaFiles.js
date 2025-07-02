const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MediaFiles = sequelize.define('MediaFiles', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    fileUrl: {type: DataTypes.STRING, allowNull: false },
    title: {type: DataTypes.STRING}

},
{timestamps: true, tableName: "mediaFiles"}
)

module.exports = MediaFiles;