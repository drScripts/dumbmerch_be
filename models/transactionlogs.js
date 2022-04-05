"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class TransactionLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionLogs.belongsTo(models.Transaction, {
        as: "logTransaction",
        foreignKey: "transactionId",
      });
    }
  }
  TransactionLogs.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: {
            tableName: "transactions",
          },
        },
      },
      raw_response: {
        type: DataTypes.JSON,
        allowNull: true,
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
      modelName: "TransactionLogs",
      tableName: "transaction_logs",
      timestamps: true,
    }
  );
  return TransactionLogs;
};
