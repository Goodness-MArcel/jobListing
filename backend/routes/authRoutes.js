import express from 'express';
import { verifyEmail, resendVerification } from '../controller/verifyController.js';
// import { register } from '../controller/authController.js';
import { register, login } from '../controller/authController.js';
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

router.post('/login', 
  [
    validateLoginEmail,
    validateLoginPassword
  ],
  login
);

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
// Other auth routes would go here

export default router;