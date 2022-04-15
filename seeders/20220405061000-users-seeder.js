"use strict";
const { hashSync } = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("users", [
      {
        name: "udin",
        email: "nathanael.vd@gmail.com",
        password: hashSync("michaeng14@123", 10),
        role: "user",
      },
      {
        name: "nathan",
        email: "nathanael1.vd@gmail.com",
        password: hashSync("michaeng14@123", 10),
        role: "admin",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
