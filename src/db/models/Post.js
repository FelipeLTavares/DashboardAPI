const { DataTypes } = require("sequelize");
const database = require("../database");

const Post = database.define("posts", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  title: DataTypes.CHAR,
  text: DataTypes.CHAR,
  imageUrl: DataTypes.STRING,
  imagePublicId: DataTypes.STRING,
});

module.exports = Post;
