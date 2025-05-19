import express from 'express';
import cookieParser from 'cookie-parser';
import sequelize from './config/dbconfig.js';
import connectFlash from './middleware/connectflash.js';
import session from 'express-session';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(connectFlash());

// Importing routes
