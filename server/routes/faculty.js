const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// Get all faculty with their projects
router.get('/api/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find().populate('projects');
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new faculty
router.post('/api/faculty', async (req, res) => {
  const faculty = new Faculty({
    name: req.body.name,
    department: req.body.department
  });

  try {
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add new project to faculty
router.post('/api/projects', async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.body.facultyId);
    faculty.projects.push({
      type: req.body.type,
      title: req.body.title,
      startDate: req.body.startDate,
      status: req.body.status,
      members: req.body.members.split(',').map(m => m.trim())
    });
    
    const updatedFaculty = await faculty.save();
    res.status(201).json(updatedFaculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;