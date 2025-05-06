const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { executeQuery } = require('../config/db');
const { verifyToken } = require('../middleware/auth');
const { attachPermissions } = require('../middleware/permissions');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/courses');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
  }
});

// GET all courses - public access allowed
router.get('/', async (req, res) => {
  try {
    const courses = await executeQuery(`
      SELECT c.*, p.name as professor_name 
      FROM courses c
      LEFT JOIN professors p ON c.professor_id = p.id
      ORDER BY c.created_at DESC
    `);
    
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET course by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [course] = await executeQuery(
      'SELECT c.*, p.name as professor_name FROM courses c LEFT JOIN professors p ON c.professor_id = p.id WHERE c.id = ?',
      [req.params.id]
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new course
router.post('/', verifyToken, attachPermissions, upload.single('image'), async (req, res) => {
  try {
    if (!req.permissions.includes('manage_courses')) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { title, code, description, semester, year, professor_id, syllabus_url } = req.body;
    const createdBy = req.user.id;
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/courses/${req.file.filename}`;
    }
    
    const result = await executeQuery(
      'INSERT INTO courses (title, code, description, semester, year, professor_id, image_url, syllabus_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, code, description, semester, year || null, professor_id || null, imageUrl, syllabus_url, createdBy]
    );
    
    res.status(201).json({ 
      message: 'Course created successfully',
      courseId: result.insertId
    });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a course
router.put('/:id', verifyToken, attachPermissions, upload.single('image'), async (req, res) => {
  try {
    if (!req.permissions.includes('manage_courses')) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { title, code, description, semester, year, professor_id, syllabus_url } = req.body;
    
    let updateQuery = 'UPDATE courses SET title = ?, code = ?, description = ?, semester = ?, year = ?, professor_id = ?, syllabus_url = ?';
    let queryParams = [title, code, description, semester, year || null, professor_id || null, syllabus_url];
    
    // Handle image upload
    if (req.file) {
      // Get old course to delete old image if exists
      const [oldCourse] = await executeQuery('SELECT image_url FROM courses WHERE id = ?', [req.params.id]);
      
      updateQuery += ', image_url = ?';
      queryParams.push(`/uploads/courses/${req.file.filename}`);
      
      // Delete old image if exists
      if (oldCourse && oldCourse.image_url) {
        const oldImagePath = path.join(__dirname, '..', oldCourse.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    updateQuery += ' WHERE id = ?';
    queryParams.push(req.params.id);
    
    await executeQuery(updateQuery, queryParams);
    
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a course
router.delete('/:id', verifyToken, attachPermissions, async (req, res) => {
  try {
    if (!req.permissions.includes('manage_courses')) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    // Get course to delete its image if exists
    const [course] = await executeQuery('SELECT image_url FROM courses WHERE id = ?', [req.params.id]);
    
    // Delete the course
    await executeQuery('DELETE FROM courses WHERE id = ?', [req.params.id]);
    
    // Delete the image file if exists
    if (course && course.image_url) {
      const imagePath = path.join(__dirname, '..', course.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
