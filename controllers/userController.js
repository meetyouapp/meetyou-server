const {
  User,
  sequelize,
  UserInterest,
  Interest,
  Image,
} = require("../models/index");
const { decode } = require("../helpers/bcrypt");
const { sign } = require("../helpers/jwt");

class UserController {
  // login user
  static async login(req, res, next) {
    const { email, password } = req.body;
    console.log(req.body, '+++++++++++++++++++++++++++++');
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
    const { username, email, password, age, gender, photo, about, interestId } =
      req.body;
    const t = await sequelize.transaction();
    try {
      const newUser = await User.create(
        { username, email, password, age, gender, photo, about },
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
      console.log(error);
      next(error);
    }
  }

  static async editProfile(req, res, next) {
    const { username, email, password, age, gender, photo, about } = req.body;
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
          age: age,
          gender: gender,
          about: about,
          photo: photo
        },
        { where: { id: findUser.id }, returning: true }
      );

      const profile = updateProfile[1][0];
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  static async editLocationProfile(req, res, next) {
    const { latitude, longitude } = req.body;

    const { id } = req.user;

    try {
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw {
          name: "NOTFOUND",
          message: `user with id ${id} not found`,
        };
      }
      const updateProfileLocation = await User.update(
        {
          latitude: latitude,
          longitude: longitude,
        },
        { where: { id: findUser.id }, returning: true }
      );

      const profile = updateProfileLocation[1][0];

      res.status(200).json(profile);
    } catch (error) {
      console.log();
      next(error);
    }
  }

  static async getProfileId(req, res, next) {
    const { id } = req.user;
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Image,
          },
          {
            model: UserInterest,
            include: {
              model: Interest,
            },
          }
        ]
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getDetailId(req, res, next) {
    const { id } = req.params
    try {
      const user = await User.findByPk(Number(id), {
        include: [
          {
            model: Image,
          },
          {
            model: UserInterest,
            include: {
              model: Interest,
            },
          }
        ]
      });
      if (!user || user === null) {
        throw {
          name: "NOTFOUND",
          message: "User Not Found",
        };
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
