const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const database = require("./src/db/database.js");
const genericRoutes = require("./src/application/Posts/postRoutes.js");
const userRoutes = require("./src/application/Users/usersRoutes.js");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", genericRoutes);
app.use("/api", userRoutes);

database.sync();

app.listen(PORT, () => {
  console.log("Servidor rodando");
});
