const { Image } = require("../models/index");

class ImageController {
  static async addImage(req, res, next) {
    const { id } = req.user
    const { imgUrl } = req.body
    try {
      const newImage = Image.create({
        imgUrl: imgUrl,
        authorId: id
      })
      res.status(201).json(newImage)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = ImageController