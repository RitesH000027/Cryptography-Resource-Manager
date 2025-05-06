const nodemailer = require('nodemailer');
const { executeQuery } = require('../config/db');
require('dotenv').config();

// Create a transporter object
let transporter;

// Initialize the email transporter based on environment
const initTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production transporter setup (e.g., SendGrid, Amazon SES, etc.)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development transporter setup using ethereal.email
    nodemailer.createTestAccount().then(testAccount => {
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Test email account created:', testAccount.user);
    }).catch(error => {
      console.error('Failed to create test email account:', error);
    });
  }
};

// Initialize transporter
initTransporter();

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 * @returns {Promise<Object>} - Delivery information
 */
const sendEmail = async (options) => {
  try {
    // If transporter not initialized yet (happens in dev)
    if (!transporter) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!transporter) {
        initTransporter();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Cryptography Resource Manager <noreply@crypto-resource.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      // Log preview URL in development
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

/**
 * Send an email with OTP for verification
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Delivery information
 */
const sendOTPEmail = async (email, otp, name) => {
  const subject = 'Verify Your Email - Cryptography Resource Manager';
  
  const text = `
    Hello ${name},
    
    Thank you for registering with Cryptography Resource Manager.
    
    Your verification code is: ${otp}
    
    This code will expire in 10 minutes.
    
    If you did not request this verification, please ignore this email.
    
    Regards,
    The Cryptography Resource Manager Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #3f51b5;">Cryptography Resource Manager</h1>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for registering with Cryptography Resource Manager. To verify your email address, please use the verification code below:</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="font-size: 24px; font-weight: bold; background-color: #f5f5f5; padding: 15px; border-radius: 5px; letter-spacing: 5px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 10px;">This code will expire in 10 minutes</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9e9e9; color: #777; font-size: 12px;">
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Regards,<br>The Cryptography Resource Manager Team</p>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

/**
 * Send a password reset email
 * @param {string} email - Recipient email
 * @param {string} resetUrl - Password reset URL
 * @param {string} name - User's name
 * @returns {Promise<Object>} - Delivery information
 */
const sendPasswordResetEmail = async (email, resetUrl, name) => {
  const subject = 'Password Reset - Cryptography Resource Manager';
  
  const text = `
    Hello ${name},
    
    You have requested to reset your password.
    
    Please click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you did not request this reset, please ignore this email.
    
    Regards,
    The Cryptography Resource Manager Team
  `;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #3f51b5;">Cryptography Resource Manager</h1>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p>Hello <strong>${name}</strong>,</p>
        <p>You have requested to reset your password. Please click the button below to create a new password:</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #3f51b5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        <p style="font-size: 12px; color: #777; margin-top: 10px;">This link will expire in 10 minutes</p>
      </div>
      
      <div style="margin-top: 20px;">
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #3f51b5;">${resetUrl}</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9e9e9; color: #777; font-size: 12px;">
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Regards,<br>The Cryptography Resource Manager Team</p>
      </div>
    </div>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendPasswordResetEmail
}; 