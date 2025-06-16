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
import addProject from './routes/postProject_routes.js';
import errorHandler from './utils/errorHandler.js';
import cors from 'cors';


const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev server
      'http://localhost:3000',  // React dev server (if you use it)
      'http://127.0.0.1:5173',  // Alternative localhost
      'https://joblisting-frontend.onrender.com' // Add your production domain here
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// app.use('/', router)
app.use('/api/auth', router);
app.use('/api/projects', addProject);

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
});