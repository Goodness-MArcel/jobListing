import sequelize from '../config/dbconfig.js';
import User from './User.js';
import Bid from './Bid.js';
import Project from './Project.js';
import Review from './Review.js';
import Message from './Message.js';

// Import any other models you have

// Set up associations after importing all models
// User.associate({ Project, Bid, Message, Review });
// Set up other model associations as needed

// Function to sync all models
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force:true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
};

export { 
  syncModels,
  sequelize,
  User,
  Bid,
  Project,
  Review,
  Message
};