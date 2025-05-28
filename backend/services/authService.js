import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from './emailService.js';


export const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: userData.email }
        ]
      }
    });
    // if(!existingUser)

    if (existingUser) {
      // Create a custom error object
      const error = new Error('Email already in use');
      error.statusCode = 409; // 409 Conflict is appropriate for duplicate resource
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_Password = await bcrypt.hash(userData.password, salt);

    // Create user with isVerified set to false initially
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: hashed_Password,
      bio: userData.role === 'freelancer' ? userData.bio : null,
      skills: userData.role === 'freelancer' ? userData.skills : null,
      isVerified: false // Set to false until email is verified
    });

    // Send verification email
    await sendVerificationEmail(user);

    // Generate JWT token (with isVerified flag)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // Return user data without password
    const userToReturn = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      isVerified: user.isVerified,
      token,
      message: 'Registration successful! Please check your email to verify your account.'
    };

    return userToReturn;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // 1. Check if user exists
const user = await User.scope('withPassword').findOne({ where: { email } });    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    console.log("User found:", user);

    // 2. Check if passwordHash exists
    if (!user.passwordHash) {
      const error = new Error('Account is missing a password. Please reset your password or contact support.');
      error.statusCode = 400;
      throw error;
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // 4. Check if account is verified (if you implement email verification)
    if (user.isVerified === false) {
      const error = new Error('Please verify your email first');
      error.statusCode = 403;
      throw error;
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // 6. Return user data (without password) and token
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
      message: 'Login successful'
    };
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

// Other services would be exported here
export default { registerUser, loginUser };