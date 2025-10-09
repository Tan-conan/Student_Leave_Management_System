const pool = require('../config/database.cjs');
const jwt = require('jsonwebtoken');

exports.fetchStudentsList = async (req, res) => {
  try {
    const { programID } = req.body;

    const [rows] = await pool.execute(
      `SELECT student_id, student_name, student_status, date_join, student_email, contact_no
        FROM Student
        WHERE program_id = ?
        ORDER BY student_id ASC`,
        [programID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active/unactivated session found' });
    }

    res.json({ students: rows });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.approveStudent = async (req, res) => {
  try {
    const { student_id } = req.body;

    await pool.execute(
      `UPDATE Student
      SET student_status = 'active'
      WHERE student_id = ?`,
        [student_id]
    );

    const [rows] = await pool.execute(
      `SELECT student_status
        FROM Student
        WHERE student_id = ?`,
        [student_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'student not found! update failed' });
    }

    res.json({ message: 'student approved succesfully! now the student account will be active.' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.body;

    // delete lecturer
    await pool.execute(
      `DELETE FROM Student
       WHERE student_id = ?`,
      [student_id]
    );

    const [rows] = await pool.execute(
      `SELECT student_id
        FROM Student
        WHERE student_id = ?`,
        [student_id]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Student rejected successfully! Now the account will be deleted' });
    } else {
        return res.json({ message: 'Student rejected failed!' });
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};