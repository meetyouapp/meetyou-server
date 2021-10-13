const { verify } = require("../helpers/jwt");
const { User } = require("../models");
const authentication = async (req, res, next) => {
  const access_token = req.headers.access_token;
  try {
    if (!access_token) {
      throw {
        name: "NOTAUTHORIZED",
        msg: "Invalid token",
      };
    }

    const payload = verify(access_token);
    const { id, email } = payload;
    const findUser = await User.findOne({
      where: {
        id,
        email,
      },
    });
    if (!findUser) {
      throw {
        name: "NOTAUTHORIZED",
        msg: "Invalid token",
      };
    }

    req.user = {
      id: findUser.id,
      email: findUser.email,
      username: findUser.username,
      location: findUser.location,
      gender: findUser.gender,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication };
