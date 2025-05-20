import sequelize from '../config/dbconfig.js';
import User from './User.js';
import Bid from './Bid.js';
import Project from './Project.js';
import Review from './Review.js';
import Message from './Message.js';

// Set up associations
User.associate({ Project, Bid, Message, Review });
// Set up other model associations as needed

// Export all models and sequelize
export {
  sequelize,
  User,
  Bid,
  Project,
  Review,
  Message
};