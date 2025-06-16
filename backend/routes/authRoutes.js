import express from 'express';
import { verifyEmail, resendVerification } from '../controller/verifyController.js';
import { protect, restrictTo, verifyAuth } from '../utils/authMiddleware.js';
import { register, login, logout } from '../controller/authController.js';
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateRole,
  validateBioIfFreelancer,
  validateSkillsIfFreelancer,
  validateLoginEmail,
  validateLoginPassword
} from '../utils/validators.js';

const router = express.Router();

// Registration route
router.post('/register', 
  [
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateRole,
    validateBioIfFreelancer,
    validateSkillsIfFreelancer
  ],
  register
);

// Login route
router.post('/login', 
  [
    validateLoginEmail,
    validateLoginPassword
  ],
  login
);

// Logout route
router.post('/logout', logout);

// Auth verification route (for protected routes)
router.get('/verify', protect, verifyAuth);

// Email verification routes
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected dashboard routes
router.get('/client/dashboard', protect, restrictTo('client'), async (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to client dashboard',
    user: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role
    }
  });
});

router.get('/freelancer/dashboard', protect, restrictTo('freelancer'), async (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to freelancer dashboard',
    user: {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      bio: req.user.bio,
      skills: req.user.skills
    }
  });
});

export default router;