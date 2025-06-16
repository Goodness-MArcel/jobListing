import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from cookie
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      throw new Error('Not authorized, no token');
    }
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      throw new Error('The user belonging to this token no longer exists');
    }
    
    // 4. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    // Handle different response types
    if (req.accepts('json')) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please log in to access this resource'
      });
    }
    
    // For traditional web apps, redirect to login
    return res.redirect('/login');
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      if (req.accepts('json')) {
        return res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to perform this action'
        });
      }
      
      return res.redirect('/dashboard');
    }
    
    next();
  };
};

// Add verification endpoint for protected routes
export const verifyAuth = async (req, res) => {
  try {
    // User is already attached by protect middleware
    const user = req.user;
    
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error during verification'
    });
  }
};