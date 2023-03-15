const jwt = require("jsonwebtoken");
require("dotenv").config();

const Cloudinary = require("../../db/cloudinary.js");
const UsersModel = require("../../db/models/User.js");
const formParser = require("../Utils/handleFormData.js");

class UsersController {
  async Create(req, res) {
    const token = req.headers["x-access-token"];
    let error;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) error = err;
    });

    if (error) return res.status(401).json({});
    try {
      const [fields, files] = await formParser(req);
      const { email, senha } = fields;

      if (!email || !senha) return res.status(400);

      const uploadData = files.image
        ? await Cloudinary.upload(files.image[0])
        : null;

      const result = await UsersModel.create({
        email,
        senha,
        ...(uploadData
          ? { imageUrl: uploadData.url, imagePublicId: uploadData.publicId }
          : {}),
      });
      return res.status(201).json({ result });
    } catch (error) {
      return res.status(400).json({});
    }
  }

  async Update(req, res) {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.json(401).end();

      res.id = decoded.id;
    });
    try {
      const [fields, files] = await formParser(req);
      const { email, senha, id } = fields;

      if (!email || !senha) res.status(400);

      const uploadData = files.image[0]
        ? await Cloudinary.upload(files.image[0])
        : null;

      const result = await UsersModel.update(
        {
          email,
          senha,
          ...(uploadData
            ? { imageUrl: uploadData.url, imagePublicId: uploadData.publicId }
            : {}),
        },
        { where: { id } }
      );
      return res.status(201).json({ result });
    } catch (error) {
      return res.status(400).json({});
    }
  }

  async Delete(req, res) {
    const token = req.headers["x-access-token"];
    let error;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) error = err;
    });

    if (error) return res.status(401).json({});

    try {
      const { email, senha } = req.body;

      const registro = await UsersModel.findAll({ where: { email, senha } });
      const user = registro.length ? registro[0].toJSON() : {};
      if (!user.id) throw "Nao existe";

      await UsersModel.destroy({
        where: {
          ...(user.id ? { id: user.id } : {}),
        },
      })
        .then(async () => {
          if (user.imagePublicId) await Cloudinary.delete(user.imagePublicId);
        })
        .catch((err) => {
          throw "Erro ao registrar";
        });

      return res.status(200).json({});
    } catch (err) {
      return res.status(400).json({});
    }
  }
}

module.exports = UsersController;
