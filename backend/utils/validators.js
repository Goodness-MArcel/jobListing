import { check } from 'express-validator';

export const validateFirstName = check('firstName')
  .notEmpty()
  .withMessage('First name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('First name must be between 2 and 50 characters')
  .trim()
  .escape();

export const validateLastName = check('lastName')
  .notEmpty()
  .withMessage('Last name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('Last name must be between 2 and 50 characters')
  .trim()
  .escape();

export const validateEmail = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

export const validatePassword = check('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

export const validateRole = check('role')
  .notEmpty()
  .withMessage('Role is required')
  .isIn(['client', 'freelancer'])
  .withMessage('Role must be either client or freelancer');

export const validateBioIfFreelancer = check('bio')
  .if((value, { req }) => req.body.role === 'freelancer')
  .notEmpty()
  .withMessage('Bio is required for freelancers')
  .isLength({ min: 20, max: 1000 })
  .withMessage('Bio must be between 20 and 1000 characters')
  .trim()
  .escape();



  export const validateLoginEmail = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Please provide a valid email')
  .normalizeEmail();

export const validateLoginPassword = check('password')
  .notEmpty()
  .withMessage('Password is required');
  

export const validateSkillsIfFreelancer = check('skills')
  .if((value, { req }) => req.body.role === 'freelancer')
  .notEmpty()
  .withMessage('Skills are required for freelancers')
  .custom(value => {
    if (!Array.isArray(value) && typeof value !== 'string') {
      throw new Error('Skills must be an array or comma-separated string');
    }
    return true;
  });