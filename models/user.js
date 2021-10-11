'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email is required'
        },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password is required'
        },
        len: {
          args: [6, 40],
          msg: 'Minimum password length is 6 characters'
        }
      }
    },
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    photo: DataTypes.STRING,
    location: DataTypes.STRING,
    about: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};