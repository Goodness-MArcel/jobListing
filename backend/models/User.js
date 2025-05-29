import { DataTypes, Model } from "sequelize";
import sequelize from "../config/dbconfig.js";

class User extends Model {}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("client", "freelancer", "admin"),
      allowNull: false,
      defaultValue: "client",
    },
    profileImageUrl: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize, // Your imported Sequelize instance
    modelName: "User",
    tableName: "users",
    // underscored: true,
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["passwordHash"] },
      },
    },
  }
);

// Define associations (can be moved to another file if preferred)
User.associate = (models) => {
  // Projects posted by the user (as client)
  User.hasMany(models.Project, {
    foreignKey: "client_id",
    as: "projectsPosted",
  });

  // Bids made by the user (as freelancer)
  User.hasMany(models.Bid, {
    foreignKey: "freelancer_id",
    as: "bidsMade",
  });

  // Messages sent by the user
  User.hasMany(models.Message, {
    foreignKey: "sender_id",
    as: "sentMessages",
  });

  // Messages received by the user
  User.hasMany(models.Message, {
    foreignKey: "receiver_id",
    as: "receivedMessages",
  });

  // Reviews given by the user
  User.hasMany(models.Review, {
    foreignKey: "reviewer_id",
    as: "reviewsGiven",
  });

  // Reviews about the user
  User.hasMany(models.Review, {
    foreignKey: "reviewee_id",
    as: "reviewsReceived",
  });
};

export default User;
