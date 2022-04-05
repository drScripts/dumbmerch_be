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

    await queryInterface.bulkInsert(
      "product_categories",
      [
        {
          productId: 1,
          categoryId: 1,
        },
        {
          productId: 2,
          categoryId: 2,
        },
        {
          productId: 3,
          categoryId: 3,
        },
        {
          productId: 4,
          categoryId: 4,
        },
        {
          productId: 1,
          categoryId: 4,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
