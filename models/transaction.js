"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.hasMany(models.TransactionItem, {
        as: "transactionItems",
        foreignKey: "transactionId",
      });
      Transaction.hasMany(models.TransactionLogs, {
        as: "transactionLogs",
        foreignKey: "transactionId",
      });
      Transaction.hasMany(models.ShipmentLogs, {
        as: "transactionShipmentLogs",
        foreignKey: "transactionId",
      });
      Transaction.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Transaction.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "failed", "success"],
        defaultValue: "pending",
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: {
            tableName: "users",
          },
        },
      },
      payment_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      raw_body: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
    }
  );
  return Transaction;
};
