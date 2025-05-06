const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Remove auth middleware from these routes
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;