const jwt = require("jsonwebtoken");
require("dotenv").config();

const UsersModel = require("../../db/models/User.js");

class LoginController {
  async Get(req, res) {
    try {
      const { email, senha } = req.query;

      const result = await UsersModel.findAll({
        where: {
          email,
          senha,
        },
      });

      if (result.length !== 1) throw "Erro";
      const token = jwt.sign({ id: result.id }, process.env.JWT_SECRET, {
        expiresIn: 43200,
      });

      return res.status(200).json({
        result: {
          ...result[0].toJSON(),
          token,
        },
      });
    } catch (err) {
      return res.status(400).json({});
    }
  }
}

module.exports = LoginController;
