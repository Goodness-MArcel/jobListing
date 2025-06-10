
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


// export const login = async (req, res, next) => {
//   try {
//     // Validate request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         success: false,
//         errors: errors.array() 
//       });
//     }

//     const { email, password } = req.body;
//     console.log("Login request received:", { email, password });

//     const userData = await authService.loginUser(email, password);

//     res.status(200).json({
//       success: true,
//       data: userData
//     });
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: error.message,
//       error: {
//         code: error.statusCode || 500,
//         details: error.message
//       }
//     });
//     console.log("Login error:", error);
//   }
// };

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Call the login service
    const userData = await authService.loginUser(email, password, res);
    
    // Determine response based on Accept header
    if (req.accepts('json')) {
      // API clients expect JSON response
      return res.status(200).json({
        status: 'success',
        data: userData,
        redirect: '/dashboard' // Optional: inform client about redirect
      });
    }
    
    // Traditional form submission - redirect to dashboard
    return res.redirect('/dashboard');
  } catch (error) {
    // Handle different types of errors appropriately
    if (req.accepts('json')) {
      return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message
      });
    }
    
    // For traditional forms, redirect back to login with flash message
    req.flash('error', error.message);
    return res.redirect('/login');
  }
};

export const logout = (req, res) => {
  authService.logoutUser(res);
  
  if (req.accepts('json')) {
    return res.status(200).json({ status: 'success' });
  }
  
  res.redirect('/login');
};

// import authService from "../services/authService.js";
export default { register , login };