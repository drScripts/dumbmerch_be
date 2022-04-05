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

    await queryInterface.bulkInsert("products", [
      {
        name: "Mouse",
        description: `- Wireless Mouse\n
          - Konektivitas wireless 2.4 GHz\n
          - Jarak wireless hingga 10 m\n
          - Plug and Play\n
          - Baterai tahan hingga 12 bulan\n
          \n
          Mouse Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.`,
        price: 500000,
        stock: 500,
        image_name: "Mouse.jpg",
        image_url:
          "https://thermaltake.azureedge.net/pub/media/catalog/product/cache/6bf0ed99c663954fafc930039201ed07/l/2/l20m01.jpg",
        userId: 2,
      },
      {
        name: "Keyboard",
        description: `- Wireless Mouse\n
          - Konektivitas wireless 2.4 GHz\n
          - Jarak wireless hingga 10 m\n
          - Plug and Play\n
          - Baterai tahan hingga 12 bulan\n
          \n
          Mouse Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.`,
        price: 700000,
        stock: 500,
        image_name: "Keyboard.jpg",
        image_url:
          "https://jete.id/wp-content/uploads/2021/09/03.-keyboard-gaming-keyboad-komputer-762x400.jpg",
        userId: 2,
      },
      {
        name: "Bag",
        description: `- Wireless Mouse\n
          - Konektivitas wireless 2.4 GHz\n
          - Jarak wireless hingga 10 m\n
          - Plug and Play\n
          - Baterai tahan hingga 12 bulan\n
          \n
          Bag Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.`,
        price: 800000,
        stock: 500,
        image_name: "Bag.jpg",
        image_url: "https://rohan.imgix.net/product/04910565.jpg",
        userId: 2,
      },
      {
        name: "Stationary",
        description: `- Wireless Stationary\n
          - Konektivitas wireless 2.4 GHz\n
          - Jarak wireless hingga 10 m\n
          - Plug and Play\n
          - Baterai tahan hingga 12 bulan\n
          \n
          Stationary Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.`,
        price: 900000,
        stock: 500,
        image_name: "Stationary.jpg",
        image_url:
          "https://5.imimg.com/data5/NN/SE/OX/SELLER-11524350/mahadev-gift-and-stationary-vadgoan-belgaum-belgaum-wnsxb-500x500.jpg",
        userId: 2,
      },
      {
        name: "Doll",
        description: `- Wireless Doll\n
          - Konektivitas wireless 2.4 GHz\n
          - Jarak wireless hingga 10 m\n
          - Plug and Play\n
          - Baterai tahan hingga 12 bulan\n
          \n
          Doll Wireless Alytech AL - Y5D, hadir dengan desain 3 tombol mouse yang ringan dan mudah dibawa. Mouse ini menggunakan frekuensi radio 2.4GHz (bekerja hingga jarak 10m) dan fitur sensor canggih optik pelacakan dengan penerima USB yang kecil. Mouse ini didukung oleh 1x baterai AA (hingga 12 bulan hidup baterai). mendukung sistem operasi Windows 7,8, 10 keatas, Mac OS X 10.8 atau yang lebih baru dan sistem operasi Chrome OS.`,
        price: 900000,
        stock: 500,
        image_name: "Doll.jpg",
        image_url:
          "https://upload.wikimedia.org/wikipedia/id/d/d1/The_Doll.jpg",
        userId: 2,
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
    await queryInterface.bulkDelete("products", null, {});
  },
};
