const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// Mock login endpoint for development purposes
// @route   POST /api/auth/mock-login
// @desc    Login with mock credentials for testing
// @access  Public (development only)
router.post('/mock-login', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Endpoint not available in production' });
  }

  const { email, password } = req.body;
  
  // For simplicity, accept any credentials that match these patterns
  const validCredentials = (
    (email === 'admin@example.com' && password === 'admin123') ||
    (email === 'user@example.com' && password === 'password123') ||
    (email === 'authorized@example.com' && password === 'password123')
  );
  
  if (!validCredentials) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Return mock user data based on email
  let userData = {
    id: 1,
    firstName: 'Mock',
    lastName: 'User',
    email: email,
    token: 'mock-jwt-token-for-development-only',
    canAccessDashboard: true
  };
  
  if (email === 'admin@example.com') {
    userData = {
      ...userData,
      role: 'admin',
      redirectTo: '/dashboard'
    };
  } else if (email === 'authorized@example.com') {
    userData = {
      ...userData,
      role: 'authorized',
      redirectTo: '/dashboard'
    };
  } else {
    userData = {
      ...userData,
      role: 'regular',
      redirectTo: '/'
    };
  }
  
  res.json(userData);
});

// @route   POST /api/auth/verify
// @desc    Verify email with OTP
// @access  Public
router.post('/verify', authController.verifyOTP);

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP verification code
// @access  Public
router.post('/resend-otp', authController.resendOTP);

// @route   GET api/auth/profile
router.get('/profile', auth, authController.getProfile);

// @route   PUT api/auth/profile
router.put('/profile', auth, authController.updateProfile);

// @route   PUT api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, authController.updatePassword);

module.exports = router;