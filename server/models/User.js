const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/db');

class User {
  static async findById(id) {
    const [user] = await executeQuery('SELECT * FROM users WHERE id = ?', [id]);
    return user;
  }

  static async findByEmail(email) {
    const [user] = await executeQuery('SELECT * FROM users WHERE email = ?', [email]);
    return user;
  }

  static async create(userData) {
    const { first_name, last_name, email, password, role = 'regular' } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await executeQuery(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, role]
    );

    return { id: result.insertId, first_name, last_name, email, role };
  }

  static async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async updateById(id, updateData) {
    if (!id || !updateData) {
      throw new Error('Invalid update parameters');
    }

    const allowedFields = ['first_name', 'last_name', 'email', 'role'];
    const updates = [];
    const values = [];

    // Process regular fields
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined && value !== null) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    // Handle password update
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return false;
    }

    values.push(id);
    const result = await executeQuery(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const result = await executeQuery('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getRole(userId) {
    const [user] = await executeQuery('SELECT role FROM users WHERE id = ?', [userId]);
    return user ? user.role : null;
  }
}

module.exports = User;