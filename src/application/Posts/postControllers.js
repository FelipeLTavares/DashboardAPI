const PostModel = require("../../db/models/Post.js");
const formParser = require("../Utils/handleFormData.js");
const Cloudinary = require("../../db/cloudinary.js");

const jwt = require("jsonwebtoken");
require("dotenv").config();

class GenericController {
  async Get(req, res) {
    // const token = req.headers["x-access-token"];
    // let error;
    // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //   if (err) error = err;
    // });

    // if (error) return res.status(401).json({});

    const { id, image, text, title, limit, offset } = req.query;

    try {
      const result = await PostModel.findAll({
        where: {
          ...(id ? { id } : {}),
          ...(image ? { image } : {}),
          ...(text ? { text } : {}),
          ...(title ? { title } : {}),
        },
        ...(limit ? { limit } : {}),
        ...(offset ? { offset } : {}),
      });

      return res.json({ result });
    } catch (err) {
      return res.status(400);
    }
  }

  async Create(req, res) {
    try {
      const token = req.headers["x-access-token"];
      let error;
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) error = err;
      });

      if (error) return res.status(401).json({});

      const [fields, files] = await formParser(req);
      const { text, title } = fields;

      if (!text || !title) res.status(400);

      const uploadData = files.imagem
        ? await Cloudinary.upload(files.imagem[0])
        : null;

      await PostModel.create({
        ...(text ? { text } : {}),
        ...(title ? { title } : {}),
        ...(uploadData
          ? { imageUrl: uploadData.url, imagePublicId: uploadData.publicId }
          : {}),
      });
      return res.status(201).json({});
    } catch (error) {
      return res.status(400).json({});
    }
  }

  async Update(req, res) {
    const token = req.headers["x-access-token"];
    let error;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) error = err;
    });

    if (error) return res.status(401).json({});

    const [fields, files] = await formParser(req);
    const { id, text, title } = fields;

    if (!text || !title) res.status(400);

    const uploadData = files.imagem
      ? await Cloudinary.upload(files.imagem[0])
      : null;

    try {
      await PostModel.update(
        {
          ...(text ? { text } : {}),
          ...(title ? { title } : {}),
          ...(uploadData
            ? { imageUrl: uploadData.url, imagePublicId: uploadData.publicId }
            : {}),
        },
        { where: { id } }
      );
      return res.status(201).json({});
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

    const { id } = req.body;

    try {
      const registro = await PostModel.findByPk(id);
      const post = registro.id ? registro.toJSON() : null;
      if (!post) throw "Não existe";

      await PostModel.destroy({
        where: { id },
      }).then(async () => {
        if (post.imagePublicId) await Cloudinary.delete(post.imagePublicId);
      });

      return res.status(200).json({});
    } catch (err) {
      return res.status(400).json({});
    }
  }
}

module.exports = GenericController;
