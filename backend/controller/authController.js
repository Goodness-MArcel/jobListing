
import authService from "../services/authService.js";
import { validationResult } from "express-validator";


export const register = async (req, res, next) => {

    try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password, role, bio, skills } = req.body;

    const userData = await authService.registerUser({
      firstName,
      lastName,
      email,
      password,
      role,
      bio,
      skills
    });

    res.status(201).json({
      message: 'Account created successfully!', // Add this message
      data: userData,
      redirect: `/registration-success?email=${encodeURIComponent(userData.email)}` // Optional
    });
  } catch (error) {
    // Send error response to client
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      // You can add more details if needed
      error: {
        code: error.statusCode || 500,
        details: error.message
      }
    });
  }
};


export const login = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    console.log("Login request received:", { email, password });

    const userData = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      error: {
        code: error.statusCode || 500,
        details: error.message
      }
    });
  }
};

// import authService from "../services/authService.js";
export default { register , login };