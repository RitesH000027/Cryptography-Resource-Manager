const Lecture = require('../models/Lecture');

const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.findAll();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(lecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLecture = async (req, res) => {
  try {
    const lecture = await Lecture.create(req.body);
    res.status(201).json(lecture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLecture = async (req, res) => {
  try {
    const updated = await Lecture.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const deleted = await Lecture.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLectures,
  getLectureById,
  createLecture,
  updateLecture,
  deleteLecture
};
