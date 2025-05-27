import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';


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

      if (existingUser) {
      // Create a custom error object
      const error = new Error('Email already in use');
      error.statusCode = 409; // 409 Conflict is appropriate for duplicate resource
      throw error;
    }


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: hashedPassword,
      role: userData.role,
      bio: userData.role === 'freelancer' ? userData.bio : null,
      skills: userData.role === 'freelancer' ? userData.skills : null,
      isVerified: false
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.jwt_secret_key,
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
      token
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // 3. Check if account is verified (if you implement email verification)
    if (!user.isVerified) {
      const error = new Error('Please verify your email first');
      error.statusCode = 403;
      throw error;
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    // 5. Return user data (without password) and token
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
export default { registerUser , loginUser };