import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 2000], // Optional character limit
      },
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // ...existing code...
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    underscored: true,
    indexes: [
      { fields: ['reviewer_id'] },
      { fields: ['reviewee_id'] },
      { fields: ['project_id'] },
      { fields: ['rating'] }, // For rating-based queries
    ],
  }
);

Review.associate = (models) => {
  Review.belongsTo(models.User, {
    as: 'reviewer',
    foreignKey: 'reviewer_id',
  });

  Review.belongsTo(models.User, {
    as: 'reviewee',
    foreignKey: 'reviewee_id',
  });

  Review.belongsTo(models.Project, {
    foreignKey: 'project_id',
  });
};

export default Review;