const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const { canAccessDashboard, isAdmin } = require('../middleware/permissions');
const lectureController = require('../middleware/lectures');
const { trackVisitor } = require('../middleware/tracking');

// All routes are protected with auth middleware
router.use(auth);

// @route   GET /api/dashboard/summary
// @desc    Get dashboard summary stats
// @access  Private/Admin or users with dashboard access
router.get('/summary', canAccessDashboard, trackVisitor, dashboardController.getDashboardSummary);

// @route   GET /api/dashboard/activity
// @desc    Get user activity metrics
// @access  Private/Admin
router.get('/activity', isAdmin, dashboardController.getActivityStats);

// @route   GET /api/dashboard/visitors
// @desc    Get visitor analytics
// @access  Private/Admin
router.get('/visitors', isAdmin, dashboardController.getVisitorStats);

// @route   GET /api/dashboard/content
// @desc    Get content stats
// @access  Private/Admin or users with dashboard access
router.get('/content', canAccessDashboard, dashboardController.getContentStats);

// @route   POST /api/dashboard/pageview
// @desc    Record a page view
// @access  Public
router.post('/pageview', dashboardController.recordPageView);

// Lecture routes
router.get('/lectures', lectureController.getLectures);
router.post('/lectures', lectureController.createLecture);
router.get('/lectures/:id', lectureController.getLectureById);
router.put('/lectures/:id', lectureController.updateLecture);
router.delete('/lectures/:id', lectureController.deleteLecture);

module.exports = router;
