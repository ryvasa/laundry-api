"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      hooks: {
        afterCreate: async (user, options) => {
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Users",
              task: "insert",
              description: `Process insert data ${JSON.stringify(
                user.toJSON()
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
      modelName: "User",
    }
  );
  return User;
};
