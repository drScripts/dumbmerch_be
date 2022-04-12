"use strict";

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
    await queryInterface.bulkInsert("carts", [
      {
        productId: 1,
        userId: 1,
        qty: 1,
      },
      {
        productId: 2,
        userId: 1,
        qty: 1,
      },
      {
        productId: 3,
        userId: 1,
        qty: 1,
      },
      {
        productId: 4,
        userId: 1,
        qty: 1,
      },
      {
        productId: 5,
        userId: 1,
        qty: 1,
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
    await queryInterface.bulkDelete("carts", null, {});
  },
};
