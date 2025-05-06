const { pool } = require('../config/db');

const trackVisitor = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const endpoint = req.originalUrl;
    const timestamp = new Date();

    await pool.query(
      'INSERT INTO visitor_logs (user_id, endpoint, timestamp) VALUES (?, ?, ?)',
      [userId, endpoint, timestamp]
    );

    next();
  } catch (error) {
    console.error('Tracking error:', error);
    next(); // Continue even if tracking fails
  }
};

module.exports = {
  trackVisitor
};
