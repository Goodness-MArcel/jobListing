import express from 'express';
import cookieParser from 'cookie-parser';
import { sequelize, User, Bid, Project, Review, Message } from './models/index.js';
import { connectFlash } from './middleware/connectflash.js';
import session from 'express-session';
// import router from './routes/index.js';
import { syncModels } from './models/sync.js';
import helmet from 'helmet';
import morgan from 'morgan';
// import authRoutes from './routes/authRoutes.js';
import router from './routes/authRoutes.js';
import errorHandler from './utils/errorHandler.js';
import cors from 'cors';


const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// app.use('/', router)
app.use('/api/auth', router);

// Error handling middleware
app.use(errorHandler);
// app.use(connectFlash);

// Importing routes

// app.get('/api/data', (req, res) => {
//   res.json({ message: 'Hello from the backend!' });
// });


// Sync all models with the database
// Pass 'true' to force sync (drops tables and recreates them)
// Use with caution in production!
syncModels(false).then(() => {
  // Start your server after models are synced
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});