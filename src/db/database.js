const { Sequelize } = require("sequelize");
require("dotenv").config();
require('pg');

const database = new Sequelize(process.env.DB_CONNECTION_URL, {
  dialect: process.env.DB_DIALECT,
});

database.sync();

module.exports = database;
