"use strict";
const { Model } = require("sequelize");
const { encode } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Like, { as: "author", foreignKey: "authorId" });
      User.hasMany(models.Like, { as: "target", foreignKey: "targetId" });

      User.hasMany(models.UserInterest, { foreignKey: "userId" });
      User.hasMany(models.Image, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Username is required",
          },
          notNull: {
            msg: "Username is required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email is required",
          },
          isEmail: {
            args: true,
            msg: "Invalid email format",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password is required",
          },
          len: {
            args: [6, 40],
            msg: "Minimum password length is 6 characters",
          },
        },
      },
      age: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            msg: "Age is required",
          },
          min: {
            args: [17],
            msg: "Minimum age is 17 years",
          },
        },
      },
      gender: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Gender is required",
          },
          notNull: {
            msg: "Gender is required",
          },
        },
      },
      photo: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Photo is required",
          },
          notNull: {
            msg: "Photo is required",
          },
        },
      },
      latitude: DataTypes.DOUBLE,
      longitude: DataTypes.DOUBLE,
      about: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = encode(user.password)
        },
        beforeBulkCreate: async (user, options) => {
          const hashed = await encode(user.password)
          user.password = hashed
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
