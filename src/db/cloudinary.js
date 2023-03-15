const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

class Cloudinary {
  static async upload(file) {
    const uploadedImg = await cloudinary.uploader
      .upload(file.path, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      })
      .then((res) => ({ url: res.url, publicId: res.public_id }))
      .catch((err) => "Erro no upload da imagem");

    return uploadedImg;
  }

  static async delete(fileId) {
    await cloudinary.uploader.destroy(fileId);
  }
}

module.exports = Cloudinary;
