"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status.hasMany(models.Order, { foreignKey: "status" });
    }
  }
  Status.init(
    {
      status: { type: DataTypes.STRING, allowNull: false },
      details: {
        type: DataTypes.TEXT,
      },
    },
    {
      hooks: {
        afterCreate: async (status, options) => {
          try {
            await sequelize.models.AuditLogs.create({
              tableName: "Status",
              task: "insert",
              description: `Process insert data ${JSON.stringify(
                status.toJSON()
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
      modelName: "Status",
    }
  );
  return Status;
};
