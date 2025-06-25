import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./emailService.js";
import crypto from "crypto";

// Get JWT_SECRET and log it
const JWT_SECRET = process.env.JWT_SECRET;
console.log('🔐 AuthService JWT_SECRET loaded:', {
  exists: !!JWT_SECRET,
  length: JWT_SECRET?.length,
  firstChars: JWT_SECRET?.substring(0, 10) + '...'
});

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not found in authService');
  process.exit(1);
}

// Token generation function with debugging
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  };

  console.log('🔐 Generating token with payload:', payload);
  console.log('🔐 Using JWT_SECRET (first 10 chars):', JWT_SECRET.substring(0, 10) + '...');

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d'
  });

  console.log('✅ Token generated successfully (first 50 chars):', token.substring(0, 50) + '...');
  
  // Immediately test the token we just generated
  try {
    const testDecode = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verification test passed:', testDecode);
  } catch (testError) {
    console.log('❌ Token verification test failed:', testError.message);
  }

  return token;
};

// Simple token verification function
const verifyToken = (token) => {
  try {
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verification successful');
    return decoded;
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log('📝 Starting user registration for:', userData.email);

    // Basic validation
    const required = ['firstName', 'lastName', 'email', 'password', 'role'];
    const missing = required.filter(field => !userData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user
    const user = await User.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash,
      role: userData.role,
      bio: userData.role === "freelancer" ? userData.bio : null,
      skills: userData.role === "freelancer" ? userData.skills || [] : [],
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    console.log('✅ User created successfully:', user.id);

    // Send verification email
    try {
      await sendVerificationEmail(user);
      console.log('✅ Verification email sent');
    } catch (emailError) {
      console.log('⚠️ Email sending failed:', emailError.message);
    }

    // Generate token
    const token = generateToken(user);

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
      message: "Registration successful! Please check your email to verify your account."
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    const err = new Error(error.message);
    err.statusCode = 400;
    throw err;
  }
};

export const loginUser = async (email, password, res) => {
  try {
    console.log('🔐 Login attempt for:', email);

    // Find user with password
    const user = await User.scope("withPassword").findOne({ 
      where: { email } 
    });

    if (!user) {
      console.log('❌ User not found:', email);
      throw new Error('Invalid email or password');
    }

    console.log('👤 User found:', user.id);

    // Check password
    if (!user.passwordHash) {
      console.log('❌ No password hash found');
      throw new Error('Account setup incomplete. Please reset your password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      throw new Error('Invalid email or password');
    }

    console.log('✅ Password valid');

    // Check verification status
    if (!user.isVerified) {
      console.log('❌ User not verified');
      const error = new Error('Please verify your email first');
      error.statusCode = 403;
      throw error;
    }

    console.log('✅ User verified');

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/'
    };

    res.cookie('token', token, cookieOptions);
    console.log('🍪 Cookie set successfully');

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      skills: user.skills,
      isVerified: user.isVerified,
      profileImageUrl: user.profileImageUrl,
      phone: user.phone,
      token, // Include for localStorage fallback
      message: "Login successful"
    };

    console.log('✅ Login successful for:', email);
    return userData;

  } catch (error) {
    console.error('❌ Login error:', error);
    const err = new Error(error.message);
    err.statusCode = error.statusCode || 401;
    throw err;
  }
};

export const logoutUser = (res) => {
  try {
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    console.log('✅ User logged out successfully');
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
};

export default { registerUser, loginUser, logoutUser, verifyToken };
