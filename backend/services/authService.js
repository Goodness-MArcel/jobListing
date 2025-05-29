import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./emailService.js";
import crypto from "crypto";

export const registerUser = async (userData) => {
  try {
    // Check if user already exists
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.password ||
      !userData.role
    ) {
      const error = new Error("Missing required registration fields");
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_Password = await bcrypt.hash(userData.password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Prepare user data
    const userPayload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: hashed_Password,
      role: userData.role,
      bio: userData.role === "freelancer" ? userData.bio : null,
      skills: userData.role === "freelancer" ? userData.skills : [],
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpires: verificationTokenExpires
    };

    let user;
    try {
      // Create user in DB
      user = await User.create(userPayload);

      // Send verification email
      await sendVerificationEmail(user);
    } catch (err) {
      console.error('Registration error:', err);
      // If email sending fails, remove the user to avoid orphaned accounts
      if (user && user.id) {
        await User.destroy({ where: { id: user.id } });
      }
      // Rethrow the error for the controller to handle
      throw err;
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    // Return user data without password
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      isVerified: user.isVerified,
      token,
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error('Registration service error:', error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // 1. Check if user exists
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
    console.log("User found:", user.email);

    // 2. Check if passwordHash exists
    if (!user.passwordHash) {
      const error = new Error(
        "Account is missing a password. Please reset your password or contact support."
      );
      error.statusCode = 400;
      throw error;
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // 4. Check if account is verified
    if (user.isVerified === false) {
      const error = new Error("Please verify your email first");
      error.statusCode = 403;
      throw error;
    }

    // 5. Update last login
    await user.update({ lastLogin: new Date() });

    // 6. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        isVerified: user.isVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    // 7. Return user data (without password) and token
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      isVerified: user.isVerified,
      token,
      message: "Login successful",
    };
  } catch (error) {
    console.error('Login service error:', error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

// Other services would be exported here
export default { registerUser, loginUser };
