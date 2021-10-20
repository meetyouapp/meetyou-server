'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = require("../data/datePlace.json");
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Places", data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Places", null, {});
  }
};
