const pool = require('../config/database.cjs');
const jwt = require('jsonwebtoken');

exports.fetchLecturersList = async (req, res) => {
  try {
    const { programID } = req.body;

    const [rows] = await pool.execute(
      `SELECT lecturer_id, lecturer_name, lecturer_status, date_join, lecturer_email, contact_no
        FROM Lecturer
        WHERE program_id = ?
        ORDER BY lecturer_id ASC`,
        [programID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active/unactivated session found' });
    }

    res.json({ lecturers: rows });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.approveLecturer = async (req, res) => {
  try {
    const { lecturer_id } = req.body;

    await pool.execute(
      `UPDATE Lecturer
      SET lecturer_status = 'active'
      WHERE lecturer_id = ?`,
        [lecturer_id]
    );

    const [rows] = await pool.execute(
      `SELECT lecturer_status
        FROM Lecturer
        WHERE lecturer_id = ?`,
        [lecturer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'lecturer not found! update failed' });
    }

    res.json({ message: 'lecturer approved succesfully! now the lecturer account will be active.' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteLecturer = async (req, res) => {
  try {
    const { lecturer_id } = req.body;

    // delete lecturer
    await pool.execute(
      `DELETE FROM Lecturer
       WHERE lecturer_id = ?`,
      [lecturer_id]
    );

    const [rows] = await pool.execute(
      `SELECT lecturer_id
        FROM Lecturer
        WHERE lecturer_id = ?`,
        [lecturer_id]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Lecturer rejected successfully! Now the account will be deleted' });
    } else {
        return res.json({ message: 'Lecturer rejected failed!' });
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};