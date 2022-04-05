"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class ShipmentLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShipmentLogs.belongsTo(models.Transaction, {
        as: "shipmentLogTransaction",
        foreignKey: "transactionId",
      });
    }
  }
  ShipmentLogs.init(
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
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shipment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "ShipmentLogs",
      tableName: "shipment_logs",
      timestamps: true,
    }
  );
  return ShipmentLogs;
};
