"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionItem.belongsTo(models.Product, {
        as: "itemProduct",
        foreignKey: "productId",
      });
      TransactionItem.belongsTo(models.Transaction, {
        as: "itemTransaction",
        foreignKey: "transactionId",
      });
    }
  }
  TransactionItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "products",
          },
          key: "id",
        },
      },
      transactionId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: "transactions",
          },
          key: "id",
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
      modelName: "TransactionItem",
      tableName: "transaction_items",
      timestamps: true,
    }
  );
  return TransactionItem;
};
