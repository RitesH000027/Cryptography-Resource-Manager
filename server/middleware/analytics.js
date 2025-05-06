const { executeQuery } = require('../config/db');

// Track visitor in analytics
const trackVisitor = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const pageUrl = req.originalUrl || req.url;
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we have a record for today
    const existingRecord = await executeQuery(
      'SELECT id FROM visitor_analytics WHERE date = ?', 
      [today]
    );
    
    if (existingRecord.length > 0) {
      // Update existing record
      await executeQuery(
        `UPDATE visitor_analytics 
         SET page_views = page_views + 1,
             unique_visitors = unique_visitors + CASE WHEN ? NOT IN (
               SELECT DISTINCT ip_address 
               FROM activity_logs 
               WHERE DATE(created_at) = ? AND ip_address IS NOT NULL
             ) THEN 1 ELSE 0 END
         WHERE date = ?`,
        [ip, today, today]
      );
    } else {
      // Create new record for today
      await executeQuery(
        `INSERT INTO visitor_analytics 
         (date, page_views, unique_visitors, new_visitors, returning_visitors) 
         VALUES (?, 1, 1, 1, 0)`,
        [today]
      );
    }
    
    // Log this activity
    if (userId) {
      await executeQuery(
        `INSERT INTO activity_logs
         (user_id, action, resource_type, description, ip_address, user_agent)
         VALUES (?, 'VIEW', 'PAGE', ?, ?, ?)`,
        [userId, pageUrl, ip, userAgent]
      );
    }
    
    next();
  } catch (error) {
    console.error('Analytics middleware error:', error);
    // Don't block the request if analytics fails
    next();
  }
};

module.exports = {
  trackVisitor
};
