const { User, Like, Image, UserInterest, Interest } = require("../models");

class SwipeController {
  // show user list in explore page (based on location, exclude if targetStatus is false)
  static async showUserList(req, res, next) {
    // console.log(req.user);
    const { id, email, username, location, gender } = req.user;
    const dataGender = gender === "female" ? "male" : "female";

    try {
      const likedByAuthor = await Like.findAll({
        where: {
          authorId: id,
        },
      });
      console.log(likedByAuthor);
      // array of user id that already liked/disliked by current logged in user
      let arrLiked = likedByAuthor.map((user) => {
        return user.id;
      });

      // console.log(arrLiked);
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
      console.log(userList);
      // filter user that already liked/disliked, and itself
      let filteredUser = userList.map((user) => {
        if (!arrLiked.includes(user.id) && user.id !== id) {
          return user;
        }
      });
      res.status("200").json(filteredUser);
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
      } else {
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
        res.status(200).json(result);
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
