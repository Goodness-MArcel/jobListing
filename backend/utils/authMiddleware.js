import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Get JWT_SECRET and log it for debugging
const JWT_SECRET = process.env.JWT_SECRET;
console.log('🔐 AuthMiddleware JWT_SECRET loaded:', {
  exists: !!JWT_SECRET,
  length: JWT_SECRET?.length,
  firstChars: JWT_SECRET?.substring(0, 10) + '...'
});

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not found in authMiddleware');
  process.exit(1);
}

export const protect = async (req, res, next) => {
  try {
    let token = null;

    console.log('🔍 AuthMiddleware: Starting token verification...');
    console.log('Request cookies:', req.cookies);
    console.log('Authorization header:', req.headers.authorization);

    // Get token from cookies or header
    if (req.cookies?.token) {
      token = req.cookies.token;
      console.log('✅ Token found in cookies');
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token found in Authorization header');
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    console.log('🔐 Token to verify (first 50 chars):', token.substring(0, 50) + '...');
    console.log('🔐 JWT_SECRET being used (first 10 chars):', JWT_SECRET.substring(0, 10) + '...');

    // Try to verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully');
      console.log('Decoded payload:', decoded);
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      console.log('JWT Error name:', jwtError.name);
      
      // Log the exact error details
      if (jwtError.name === 'JsonWebTokenError') {
        console.log('🔍 This is a signature verification error');
        console.log('🔍 Token might have been signed with different secret');
      } else if (jwtError.name === 'TokenExpiredError') {
        console.log('🔍 Token has expired');
      }

      // Clear the invalid cookie
      res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
        error: jwtError.message,
        errorType: jwtError.name
      });
    }

    // Get user from database
    console.log('👤 Looking up user with ID:', decoded.id);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isVerified) {
      console.log('❌ User not verified');
      return res.status(401).json({
        success: false,
        message: 'Account not verified'
      });
    }

    console.log('✅ Authentication successful for user:', user.email);
    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Access denied. User role: ${req.user.role}, Required: ${roles}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    }

    console.log(`✅ Access granted. User role: ${req.user.role}`);
    next();
  };
};

export const verifyAuth = (req, res) => {
  console.log('✅ Sending verification response for user:', req.user.email);
  
  res.status(200).json({
    success: true,
    message: 'Authentication verified',
    user: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      profileImageUrl: req.user.profileImageUrl,
      bio: req.user.bio,
      skills: req.user.skills,
      phone: req.user.phone
    }
  });
};