"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, { as: "author", foreinKey: "authorId" });
      Like.belongsTo(models.User, { as: "target", foreinKey: "targetId" });
    }
  }
  Like.init(
    {
      authorId: DataTypes.INTEGER,
      authorStatus: DataTypes.BOOLEAN,
      targetId: DataTypes.INTEGER,
      targetStatus: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
