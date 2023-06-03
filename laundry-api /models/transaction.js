"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Order, {
        foreignKey: "order_id",
      });
    }
  }
  Transaction.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      payment_method: { type: DataTypes.STRING, allowNull: false },
    },
    {
      hooks: {
        afterCreate: async (transaction, options) => {
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Transactions",
              task: "insert",
              description: `Process insert data ${JSON.stringify(
                transaction.toJSON()
              )}`,
            });
          } catch (error) {
            console.log(error);
          }
        },
      },
      sequelize,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
