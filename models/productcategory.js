"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ProductCategory.belongsTo(models.Product, {
      //   as: "products",
      //   foreignKey: "productId",
      // });
    }
  }
  ProductCategory.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: {
            tableName: "products",
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: {
            tableName: "categories",
          },
        },
        field: "categoryId",
      },
    },
    {
      sequelize,
      modelName: "ProductCategory",
      tableName: "product_categories",
    }
  );

  return ProductCategory;
};
