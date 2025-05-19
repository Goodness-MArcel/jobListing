import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Import your configured Sequelize instance

class Message extends Model {}

// Model initialization
Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensure message isn't empty
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    underscored: true,
    timestamps: true, // Adds createdAt and updatedAt automatically
    indexes: [
      { fields: ['sender_id'] },
      { fields: ['receiver_id'] },
      { fields: ['created_at'] }, // For sorting messages by time
    ],
  }
);

// Define associations
Message.associate = (models) => {
  Message.belongsTo(models.User, {
    as: 'sender',
    foreignKey: 'sender_id',
  });

  Message.belongsTo(models.User, {
    as: 'receiver',
    foreignKey: 'receiver_id',
  });
};

export default Message;