import { Model, DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js"; // Import your configured Sequelize instance

class Bid extends Model {}

// Model initialization
Bid.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 1.0, // Minimum bid amount
      },
    },
    proposal: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 2000],
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "withdrawn"),
      defaultValue: "pending",
    },
    deliveryTime: {
      type: DataTypes.INTEGER, // in days
      allowNull: false,
      validate: {
        min: 1, // Minimum 1 day
      },
    },
    revisions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "projects",
        key: "id",
      },
    },
  },
  {
    sequelize, // Your imported Sequelize instance
    modelName: "Bid",
    tableName: "bids",
    underscored: true,
    indexes: [
      { fields: ["project_id"] },
      { fields: ["freelancer_id"] },
      { fields: ["status"] },
    ],
  }
);

// Define associations
Bid.associate = (models) => {
  Bid.belongsTo(models.User, {
    foreignKey: "freelancer_id",
    as: "freelancer",
  });

  Bid.belongsTo(models.Project, {
    foreignKey: "project_id",
    as: "project",
  });
};

export default Bid;
