const { DataTypes } = require("sequelize");
const database = require("../database");

const User = database.define("users", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  email: DataTypes.CHAR,
  senha: DataTypes.CHAR,
  imageUrl: DataTypes.STRING,
  imagePublicId: DataTypes.STRING,
});

module.exports = User;
