import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Import your configured Sequelize instance

class Project extends Model {}

// Model initialization
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [20, 5000],
      },
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 5.0,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'draft',
        'published',
        'in_progress',
        'completed',
        'cancelled'
      ),
      defaultValue: 'draft',
    },
    skillsRequired: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize, // Your imported Sequelize instance
    modelName: 'Project',
    tableName: 'projects',
    underscored: true,
    indexes: [
      { fields: ['title'] },
      { fields: ['status'] },
      { fields: ['client_id'] },
    ],
  }
);

// Define associations
Project.associate = (models) => {
  Project.belongsTo(models.User, {
    foreignKey: 'client_id',
    as: 'client',
  });

  Project.hasMany(models.Bid, {
    foreignKey: 'project_id',
    as: 'bids',
  });

  Project.hasOne(models.Review, {
    foreignKey: 'project_id',
    as: 'review',
  });
};

export default Project;