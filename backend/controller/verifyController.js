import { verifyEmailToken } from '../services/emailService.js';
import User from '../models/User.js';
import { sendVerificationEmail } from '../services/emailService.js';
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await verifyEmailToken(token);

    res.status(200).json({
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
      message: error.message
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