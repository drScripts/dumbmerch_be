'use strict'
const { Model, Sequelize, DataTypes } = require('sequelize')

/**
 *
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.User, {
        as: 'recipient',
        foreignKey: 'idRecipient',
        onDelete: 'CASCADE',
      })
      Chat.belongsTo(models.User, {
        as: 'sender',
        foreignKey: 'idSender',
        onDelete: 'CASCADE',
      })
    }
  }
  Chat.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      idSender: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      idRecipient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: Date.now(),
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      timestamps: true,
      tableName: 'chats',
    },
  )
  return Chat
}
