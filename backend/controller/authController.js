  import authService from "../services/authService.js";
  import { validationResult } from "express-validator";

  export const register = async (req, res) => {
    try {
      console.log('📝 Registration request received');

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
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

      console.log('✅ Registration successful');
      res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: userData
      });
    } catch (error) {
      console.error('❌ Registration controller error:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  };

  export const login = async (req, res) => {
    try {
      console.log('🔐 Login request received');

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
    
      // Call the login service
      const userData = await authService.loginUser(email, password, res);
    
      console.log('✅ Login controller successful');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: userData
      });
    } catch (error) {
      console.error('❌ Login controller error:', error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  };

  export const logout = (req, res) => {
    try {
      console.log('👋 Logout request received');
      authService.logoutUser(res);
    
      return res.status(200).json({ 
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('❌ Logout error:', error);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  };

  export default { register, login, logout };