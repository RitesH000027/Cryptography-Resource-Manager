const db = require('../config/db');

class Lecture {
  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS lectures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('basics', 'symmetric', 'asymmetric', 'advanced') DEFAULT 'basics',
        instructor VARCHAR(255) NOT NULL,
        videoUrl VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) DEFAULT '',
        downloadUrl VARCHAR(255) DEFAULT '',
        duration INT DEFAULT 0,
        createdBy INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    return db.query(sql);
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM lectures');
    return rows;
  }

  static async create(lecture) {
    const sql = `INSERT INTO lectures SET ?`;
    const [result] = await db.query(sql, [lecture]);
    return result;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM lectures WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, lecture) {
    const sql = 'UPDATE lectures SET ? WHERE id = ?';
    const [result] = await db.query(sql, [lecture, id]);
    return result.affectedRows > 0 ? this.findById(id) : null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM lectures WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Lecture;