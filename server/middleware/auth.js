const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/db');
const { attachPermissions } = require('./permissions');

// Helper function to check if the route is profile-related
const isProfileRoute = (path) => {
  return path.includes('/api/auth/profile') || path.includes('/api/users/profile');
};

// Verify JWT token middleware
const auth = async (req, res, next) => {
  // Log the request path for debugging
  console.log('Auth middleware - Request path:', req.path);
  console.log('Auth token:', req.header('x-auth-token') ? 'Token exists' : 'No token');

  // Skip auth check for these routes
  if (req.path.startsWith('/api/admin/stats') || 
      req.path.startsWith('/api/resources') ||
      req.path === '/api/resources/upload' ||
      req.path.startsWith('/api/admin/users')) {
    console.log('Auth check bypassed for:', req.path);
    // For bypassed auth, add a mock user with admin permissions
    req.user = {
      id: 1,
      role: 'admin'
    };
    return next();
  }

  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with permissions
    const user = await executeQuery('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [decoded.id]);
    
    if (user.length === 0) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Skip updating last login time as the column doesn't exist
    // If last_login tracking is needed, the users table schema should be updated first
    
    // Add user info to request
    req.user = user[0];
    
    // Skip permission checks for profile routes
    if (!isProfileRoute(req.path)) {
      await attachPermissions(req, res, next);
    } else {
      next();
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;