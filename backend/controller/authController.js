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
        success: true,
        message: 'Account created successfully!',
        data: userData,
        redirect: `/registration-success?email=${encodeURIComponent(userData.email)}`
      });
    } catch (error) {
      console.error('Registration controller error:', error);
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
    
      // Call the login service
      const userData = await authService.loginUser(email, password, res);
    
      // Always return JSON for API clients
      return res.status(200).json({
        status: 'success',
        data: userData,
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login controller error:', error);
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  export const logout = (req, res) => {
    try {
      authService.logoutUser(res);
    
      return res.status(200).json({ 
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Error during logout'
      });
    }
  };

  export default { register, login, logout };