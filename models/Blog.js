const { Sequelize, DataTypes, BOOLEAN } = require("sequelize");
const { sequelize } = require("../config/database");

const Blog = sequelize.define(
  "Blog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    blogAuthor: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT, allowNull: false },
    publish: { type: DataTypes.BOOLEAN, defaultValue: false },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("tags");
        return raw ? raw.split(",") : [];
      },
      set(value) {
        this.setDataValue(
          "tags",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "blogs",
  }
);

module.exports = Blog;
