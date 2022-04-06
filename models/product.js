"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, {
        as: "user",
        onDelete: "CASCADE",
        foreignKey: "userId",
      });

      Product.belongsToMany(models.Category, {
        as: "categories",
        through: {
          model: "ProductCategory",
          as: "bridge",
        },
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      description: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      image_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: {
            tableName: "users",
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Product",
      tableName: "products",
    }
  );
  return Product;
};
