const { Like, User, Chat } = require("../models");
class ChatController {
  static async getChat(req, res, next) {
    const { id } = req.user;
    try {
      //user sbg author
      const chatListAuthor = await Chat.findAll({
        where: {
          authorId: id,
        },
        include: [{ model: User, as: "target" }],
      });

      //user sbg target
      const chatListTarget = await Chat.findAll({
        where: {
          targetId: id,
        },
        include: [{ model: User, as: "author" }],
      });

      res.status(200).json({ chatListAuthor, chatListTarget });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = ChatController;
