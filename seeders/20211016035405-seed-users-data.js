'use strict';
const { encode } = require("../helpers/bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
     let data = require("../data/users.json");
     data.forEach((el) => {
       el.password = encode("123456")
       el.createdAt = new Date();
       el.updatedAt = new Date();
     });
     await queryInterface.bulkInsert("Users", data, {validate: true, individualHooks: true});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
