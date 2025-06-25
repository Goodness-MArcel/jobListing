import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Validate JWT_SECRET on startup
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in authMiddleware');
  process.exit(1);
}

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookie first (preferred)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('Token found in cookies');
    }
    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
      console.log('Token found in Authorization header');
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token with SAME secret and options as login
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'jobListing-backend',
      audience: 'jobListing-frontend'
    });

    console.log('Token verified successfully for user:', decoded.id);
    
    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is still verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Clear invalid cookie
    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Add verification endpoint for protected routes
export const verifyAuth = (req, res) => {
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
      profileImageUrl: req.user.profileImageUrl
    }
  });
};