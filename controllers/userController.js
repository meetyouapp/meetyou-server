const {
  User,
  sequelize,
  UserInterest,
  Interest,
  Image,
  Like,
} = require("../models");
const { decode } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");

class UserController {
  // login user
  static async login(req, res, next) {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
      const foundUser = await User.findOne({ where: { email } });
      if (!foundUser) {
        throw { name: "NOTAUTHORIZED", message: "Invalid Email/Password" };
      }
      const isMatch = decode(password, foundUser.password);
      if (!isMatch) {
        throw { name: "NOTAUTHORIZED", message: "Invalid Email/Password" };
      }

      const access_token = sign({
        id: foundUser.id,
        email: foundUser.email,
      });
      res.status(200).json({
        id: foundUser.id,
        email: foundUser.email,
        access_token: access_token,
      });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
  // register
  static async register(req, res, next) {
    const {
      username,
      email,
      password,
      age,
      gender,
      photo,
      about,
      location,
      interestId,
    } = req.body;
    const t = await sequelize.transaction();
    try {
      const newUser = await User.create(
        { username, email, password, age, gender, photo, about, location },
        { transaction: t }
      );

      const promises = interestId.map(async (interest) => {
        await UserInterest.create(
          {
            interestId: interest,
            userId: newUser.id,
          },
          { transaction: t }
        );
      });

      Promise.all(promises)
        .then(async (_) => {
          await t.commit();
          res.status(201).json(newUser);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async editProfile(req, res, next) {
    const {
      username,
      email,
      password,
      age,
      gender,
      photo,
      about,
      location,
      imgUrl,
    } = req.body;

    const { id } = req.user;

    try {
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw {
          name: "NOTFOUND",
          message: `user with id ${id} not found`,
        };
      }
      const updateProfile = await User.update(
        {
          username: username,
          email: email,
          password: password,
          age: age,
          gender: gender,
          photo: photo,
          about: about,
          location: location,
        },
        { where: { id: findUser.id }, returning: true }
      );

      const profile = updateProfile[1][0];

      const promises = imgUrl.map(async (url) => {
        await Image.create({
          imgUrl: url,
          authorId: profile.id,
        });
      });

      Promise.all(promises)
        .then(async (_) => {
          console.log("berhasil");
        })
        .catch((error) => {
          throw error;
        });

      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async getInterest(req, res, next) {
    try {
      const interestUser = await UserInterest.findAll({
        include: [User, Interest],
      });
      res.status(200).json(interestUser);
    } catch (error) {
      next(error);
    }
  }

  static async getInterestLogin(req, res, next) {
    const { id } = req.user;
    // console.log(id);
    try {
      const interestUser = await UserInterest.findAll({
        where: {
          userId: id,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
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
      next(error);
    }
  }

  static async getProfileId(req, res, next) {
    const { id } = req.body;
    try {
      const user = await UserInterest.findByPk(id, {
        include: {
          model: UserInterest,
          include: {
            model: Interest,
          },
        },
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getChat(req, res, next) {
    const { id } = req.user;
    try {
      const chatListAuthor = await Like.findAll({
        where: {
          authorId: id,
          authorStatus: true,
          targetStatus: true,
        },
        include: [
          { model: User, as: "author" },
          { model: User, as: "target" },
        ],
      });

      const chatListTarget = await Like.findAll({
        where: {
          targetId: id,
          authorStatus: true,
          targetStatus: true,
        },
        include: [
          { model: User, as: "author" },
          { model: User, as: "target" },
        ],
      });

      const result = [...chatListAuthor, ...chatListTarget];

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
