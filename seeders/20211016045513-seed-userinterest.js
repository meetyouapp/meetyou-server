'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     let data = require("../data/userInterest.json");
     data.forEach((el) => {
       el.createdAt = new Date();
       el.updatedAt = new Date();
     });
     await queryInterface.bulkInsert("UserInterests", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("UserInterests", null, {});
  }
};