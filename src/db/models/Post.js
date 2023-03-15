const { DataTypes } = require("sequelize");
const database = require("../database");

const Post = database.define("posts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.CHAR,
  text: DataTypes.TEXT,
  imageUrl: DataTypes.STRING,
  imagePublicId: DataTypes.STRING,
  authorName: DataTypes.STRING,
  authorPhoto: DataTypes.STRING,
});

module.exports = Post;
