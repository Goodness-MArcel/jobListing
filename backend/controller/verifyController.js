import { verifyEmailToken } from '../services/emailService.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import { sendVerificationEmail } from '../services/emailService.js';

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with the verification token and check if it's not expired
    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          [Op.gt]: new Date() // Token should not be expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified!',
        data: {
          email: user.email,
          isVerified: true
        }
      });
    }

    // Update user verification status
    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        email: user.email,
        isVerified: true
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Verification failed'
    });
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    await sendVerificationEmail(user);

    res.status(200).json({
      success: true,
      message: 'Verification email resent successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};