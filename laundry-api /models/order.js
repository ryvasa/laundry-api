"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Status, {
        foreignKey: "status",
      });
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
      });
      Order.hasOne(models.Transaction, {
        foreignKey: "order_id",
      });
    }
  }
  Order.init(
    {
      weight: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Statuses",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        defaultValue: 1,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      hooks: {
        afterCreate: async (order, options) => {
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Orders",
              task: "insert",
              description: `Process insert data ${JSON.stringify(
                order.toJSON()
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
      modelName: "Order",
    }
  );
  return Order;
};
