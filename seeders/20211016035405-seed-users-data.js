'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     let data = require("../data/users.json");
     data.forEach((el) => {
       el.createdAt = new Date();
       el.updatedAt = new Date();
     });
     await queryInterface.bulkInsert("Users", data, {validate: true, individualHooks: true});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
