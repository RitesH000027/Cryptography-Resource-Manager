const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { executeQuery } = require('../config/db');
const { sendOTPEmail } = require('../utils/emailService');

// @desc    Update user password
// @route   PUT /api/auth/password
// @access   Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Current password and new password are required');
  }

  const user = await executeQuery('SELECT * FROM users WHERE id = ?', [req.user.id]);
  
  if (user.length === 0) {
    console.error('User not found for email:', email);
    res.status(404);
    throw new Error('User not found');
  }

  const isValid = await bcrypt.compare(currentPassword, user[0].password);
  if (!isValid) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await executeQuery('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

  res.json({ success: true, message: 'Password updated successfully' });
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new user with OTP verification
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Check if email already exists
  const existingUser = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);

  if (existingUser.length > 0) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Start transaction
    await executeQuery('START TRANSACTION');

    // Insert user
    const result = await executeQuery(
      `INSERT INTO users (first_name, last_name, email, password, role) 
       VALUES (?, ?, ?, ?, 'regular')`,
      [firstName, lastName, email, hashedPassword]
    );
    
    const userId = result.insertId;

    // Store OTP
    await executeQuery(
      `INSERT INTO verification_tokens (user_id, token, expires_at) 
       VALUES (?, ?, ?)`,
      [userId, otp, otpExpiry]
    );

    // Send verification email
    await sendOTPEmail(email, otp, `${firstName} ${lastName}`);

    // Commit transaction
    await executeQuery('COMMIT');

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    await executeQuery('ROLLBACK');
    res.status(500);
    throw new Error('Registration failed: ' + error.message);
  }
});

// @desc    Verify email with OTP
// @route   POST /api/auth/verify
// @access  Public
const verifyOTP = async (req, res) => {
  console.log('Starting OTP verification for email:', req.body.email);
  const { email, otp } = req.body;
  console.log('Verification attempt - Email:', email, 'OTP:', otp);

  if (!email || !otp) {
    res.status(400);
    throw new Error('Email and OTP are required');
  }

  const user = await executeQuery(
    'SELECT u.*, vt.token, vt.expires_at FROM users u LEFT JOIN verification_tokens vt ON u.id = vt.user_id WHERE u.email = ?',
    [email]
  );

  if (user.length === 0) {
    console.error('User not found for email:', email);
    res.status(404);
    throw new Error('User not found');
  }

  if (!user[0].token || user[0].token !== otp) {
    console.error('OTP mismatch - Stored:', user[0].token, 'Received:', otp);
    res.status(400);
    throw new Error('Invalid OTP');
  }

  if (new Date() > new Date(user[0].expires_at)) {
    console.error('OTP expired - Expiry time:', user[0].expires_at);
    res.status(400);
    throw new Error('OTP has expired');
  }

  // Update user and remove verification token
  await executeQuery('START TRANSACTION');
  try {
    await executeQuery('UPDATE users SET email_verified = TRUE WHERE id = ?', [user[0].id]);
    await executeQuery('DELETE FROM verification_tokens WHERE user_id = ?', [user[0].id]);
    await executeQuery('COMMIT');

    const token = generateToken(user[0].id);

    res.json({
      id: user[0].id,
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      email: user[0].email,
      role: user[0].role,
      token
    });
  } catch (error) {
    await executeQuery('ROLLBACK');
    res.status(500);
    throw new Error('Verification failed: ' + error.message);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const users = await executeQuery(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!user.email_verified) {
    res.status(401);
    throw new Error('Please verify your email before logging in');
  }

  const token = generateToken(user.id);

  // Check user's dashboard access
  let canAccessDashboard = user.role === 'admin' || user.role === 'authorized';
  
  // If not admin/authorized, check permissions
  if (!canAccessDashboard) {
    const permissions = await executeQuery(
      'SELECT access_dashboard FROM user_permissions WHERE user_id = ?',
      [user.id]
    );
    canAccessDashboard = permissions.length > 0 && permissions[0].access_dashboard === 1;
  }

  res.json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    token,
    redirectTo: canAccessDashboard ? '/dashboard' : '/',
    canAccessDashboard
  });
});

// @desc    Resend OTP verification code
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  // Check if user exists
  const users = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) {
    res.status(404);
    throw new Error('User not found');
  }

  const user = users[0];

  // If user is already verified
  if (user.email_verified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // Start transaction
    await executeQuery('START TRANSACTION');

    // Delete existing OTP if any
    await executeQuery('DELETE FROM verification_tokens WHERE user_id = ?', [user.id]);

    // Store new OTP
    await executeQuery(
      `INSERT INTO verification_tokens (user_id, token, expires_at) 
       VALUES (?, ?, ?)`,
      [user.id, otp, otpExpiry]
    );

    // Send verification email
    await sendOTPEmail(email, otp, `${user.first_name} ${user.last_name}`);

    // Commit transaction
    await executeQuery('COMMIT');

    res.status(200).json({
      message: 'Verification code has been resent. Please check your email.',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    await executeQuery('ROLLBACK');
    res.status(500);
    throw new Error('Failed to resend verification code: ' + error.message);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await executeQuery('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [req.user.id]);
  
  if (!user.length) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    id: user[0].id,
    firstName: user[0].first_name,
    lastName: user[0].last_name,
    email: user[0].email,
    role: user[0].role
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  
  if (!firstName || !lastName) {
    res.status(400);
    throw new Error('First name and last name are required');
  }

  const result = await executeQuery(
    'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
    [firstName, lastName, req.user.id]
  );

  if (result.affectedRows === 0) {
    res.status(404);
    throw new Error('User not found');
  }

  const updatedUser = await executeQuery(
    'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
    [req.user.id]
  );

  res.json({
    id: updatedUser[0].id,
    firstName: updatedUser[0].first_name,
    lastName: updatedUser[0].last_name,
    email: updatedUser[0].email,
    role: updatedUser[0].role
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  resendOTP,
  getProfile,
  updateProfile,
  updatePassword
};