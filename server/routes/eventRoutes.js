const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/events
 * @desc    Get all events (both internal and external)
 * @access  Private
 */
router.get('/', eventController.getAllEvents);

/**
 * @route   GET /api/events/internal
 * @desc    Get internal events only
 * @access  Private
 */
router.get('/internal', eventController.getInternalEvents);

/**
 * @route   GET /api/events/external
 * @desc    Get external events only
 * @access  Private
 */
router.get('/external', eventController.getExternalEvents);

/**
 * @route   POST /api/events
 * @desc    Create a new internal event
 * @access  Private (Admin and Authorised users only)
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startDate').notEmpty().withMessage('Start date is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('organizerName').notEmpty().withMessage('Organizer name is required')
  ],
  eventController.createEvent
);

/**
 * @route   PUT /api/events/:eventId
 * @desc    Update an existing internal event
 * @access  Private (Admin and event creator only)
 */
router.put(
  '/:eventId',
  [
    body('title').optional(),
    body('description').optional(),
    body('startDate').optional(),
    body('endDate').optional(),
    body('location').optional(),
    body('organizerName').optional()
  ],
  eventController.updateEvent
);

/**
 * @route   PATCH /api/events/:eventId/status
 * @desc    Approve or reject an internal event
 * @access  Private (Admin only)
 */
router.patch(
  '/:eventId/status',
  eventController.updateEventStatus
);

/**
 * @route   DELETE /api/events/:eventId
 * @desc    Delete an internal event
 * @access  Private (Admin and event creator only)
 */
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;
