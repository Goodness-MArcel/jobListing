import express from 'express';
import User from '../models/User.js';
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
router.get('/info', protect, restrictTo('client'), async (req, res) => {
  try {
    // Get client_id from query params instead of route params
    const clientId = req.query.client_id || req.user.id; // Fallback to authenticated user's id
    
    // Get full client info from database
    const client = await User.findOne({
      where: { id: clientId }, // Use clientId variable
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'company',
        'location',
        'bio',
        'website',
        'profileImageUrl'
      ]
    });
console.log(client)
    if (!client) {
      return res.status(404).json({
        status: 'fail',
        message: 'Client not found'
      });
    }

    res.json({
      status: 'success',
      client: {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        company: client.company,
        location: client.location,
        bio: client.bio,
        website: client.website,
        profileImageUrl: client.profileImageUrl 
          ? `${req.protocol}://${req.get('host')}/uploads/profiles/${client.profileImageUrl}`
          : null
      }
    });
    
  } catch (error) {
    console.error('Client info error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
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