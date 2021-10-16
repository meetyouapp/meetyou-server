const {
  User,
  Like,
  Image,
  UserInterest,
  Interest,
  Chat,
} = require("../models");
const { Op } = require('sequelize')

class SwipeController {
  // show user list in explore page (based on location, exclude if targetStatus is false)
  static async showUserList(req, res, next) {
    const { id, email, username, location, gender } = req.user;
    const dataGender = gender === "female" ? "male" : "female";

    try {
      // array of user id that already liked/disliked by current logged in user
      const swipedByAuthor = await Like.findAll({
        where: {
          authorId: id,
        },
      });
      let arrSwiped = await swipedByAuthor.map((user) => {
        return user.targetId
      });

      // array of user id that that liked/disliked back by current logged in user
      const swipedBack = await Like.findAll({
        where: {
          targetId: id,
          targetStatus: {
            [Op.not]: null
          }
        },
      });
      let arrSwipedBack = await swipedBack.map((user) => {
        return user.authorId
      });

      const userList = await User.findAll({
        where: {
          gender: dataGender,
        },
        include: [
          {
            model: Image,
          },
          {
            model: UserInterest,
            include: [Interest],
          },
        ],
      });
      // filter user that already liked/disliked, and itself
      let filteredUser = await userList.filter((user) => {
        if (!arrSwiped.includes(user.id) &&  !arrSwipedBack.includes(user.id) && user.id !== id) {
          return user;
        }
      });
      res.status(200).json(filteredUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  // swipe right / yes
  static async swipeRight(req, res, next) {
    const { id, email, username, location, gender } = req.user;
    const { targetId } = req.body;

    try {
      // to check if current logged in user already liked by target
      const likedData = await Like.findOne({
        where: {
          authorId: targetId,
          targetId: id,
        },
      });
      // if target has not liked/disliked the current user
      if (!likedData) {
        const swipedRight = await Like.create({
          authorId: id,
          authorStatus: true,
          targetId: targetId,
          targetStatus: null,
        });
        res.status(201).json(swipedRight);
        // it the target already liked/disliked the current user
      }
      const match = await Like.update(
        {
          targetStatus: true,
        },
        {
          where: {
            authorId: targetId,
            targetId: id,
          },
          returning: true,
        }
      );
      const result = match[1][0];
      if (result.targetStatus && result.authorStatus === true) {
        const createChat = await Chat.create({
          authorId: result.authorId,
          targetId: result.targetId,
        });
        res.status(200).json(createChat);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
  // swipe left / no
  static async swipeLeft(req, res, next) {
    const { id, email, username, location, gender } = req.user;
    const { targetId } = req.body;

    try {
      const likedData = await Like.findOne({
        where: {
          authorId: targetId,
          targetId: id,
        },
      });
      // if target has not liked/disliked the current user
      if (!likedData) {
        const swipedLeft = await Like.create({
          authorId: id,
          authorStatus: false,
          targetId: targetId,
          targetStatus: null,
        });
        res.status(201).json(swipedLeft);
        // if the target already liked/disliked the current user
      } else {
        const dislike = await Like.update(
          {
            targetStatus: false,
          },
          {
            where: {
              authorId: targetId,
              targetId: id,
            },
            returning: true,
          }
        );
        const result = dislike[1][0];
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = SwipeController;
