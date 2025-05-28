import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import  User  from '../models/User.js';
import { Op } from 'sequelize';

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: 'ihusuxvraarjwhht'
  }
});

export const sendVerificationEmail = async (user) => {
  // Generate verification token
  const verificationToken = uuidv4();
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update user with verification token
  await User.update(
    { verificationToken, verificationTokenExpires },
    { where: { id: user.id } }
  );

  // Create verification URL
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

  // Email options
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Verify Your Email Address',
    html: `
      <h2>Welcome to Our App!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  // Send email
  await transporter.sendMail(mailOptions);
  //contiue testing
};

export const verifyEmailToken = async (token) => {
  // Find user with matching token and unexpired token
  const user = await User.findOne({
    where: {
      verificationToken: token,
      verificationTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  // Update user to set as verified and clear token fields
  await User.update(
    {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
    { where: { id: user.id } }
  );

  // Optionally, return updated user (fresh from DB)
//   return await User.findByPk(user.id);
};