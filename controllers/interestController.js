const { User, Interest, UserInterest } = require("../models");
class InterestController {
  static async getInterestLogin(req, res, next) {
    const { id } = req.user;
    try {
      const interestUser = await UserInterest.findAll({
        where: {
          userId: id,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: Interest,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(interestUser);
    } catch (error) {
      console.log(error, "====di interest ====")
      next(error);
    }
  }
}

module.exports = InterestController;
