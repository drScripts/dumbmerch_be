"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, {
        as: "profile",
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "user"],
        defaultValue: "user",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
    }
  );
  return User;
};
