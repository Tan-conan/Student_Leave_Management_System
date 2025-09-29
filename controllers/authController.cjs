const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES = '2h';

function pickUserRow(role, row) {
  if (!row) return null;
  if (role === 'student') {
    return {
      id: row.student_id,
      name: row.student_name,
      email: row.student_email,
      program: row.program_id,
      role: 'student'
    };
  }
  if (role === 'lecturer') {
    return {
      id: row.lecturer_id,
      name: row.lecturer_name,
      email: row.lecturer_email,
      program: row.program_id,
      role: 'lecturer'
    };
  }
  if (role === 'hop') {
    return {
      id: row.hop_id,
      name: row.hop_name,
      email: row.hop_email,
      program: row.program_id,
      role: 'hop'
    };
  }
  return null;
}

exports.programList = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT program_id, program_name FROM Program ORDER BY program_name'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.register = async (req, res) => {
  console.log('req.body:', req.body);

  try {
    const { role, name, email, password, student_id, program_name, date_join, contact_no, leave_balance, status } = req.body;
    if (role === '' || !name || !email || !password || !date_join || program_name === '') {
      return res.status(400).json({ message: 'Please fill in all the forms!' });
    }

    //^[^\s@]+      ：must have words in front of @，and cant have space or another @
    //@[^\s@]+      ：must have one @，and back cant have space or second @
    // //\.[^\s@]+$ ：must have . ，and must have words after it

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format!' });
    }

    if (role === 'student' && !student_id) {
      return res.status(400).json({ message: 'Please fill in the student ID!' });
    }

    

    let program_id = null;
    if (program_name) {
      const [rows] = await pool.query(
        'SELECT program_id FROM Program WHERE program_name = ?',
        [program_name]
      );
      if (!rows.length) {
        return res.status(400).json({ message: 'Invalid program name' });
      }
      program_id = rows[0].program_id;
    }

    const hashed = await bcrypt.hash(password, 10);

    if (role === 'student') {
      const [exists] = await pool.query('SELECT 1 FROM Student WHERE student_email = ? OR student_id = ?', [email , student_id]);
      if (exists.length) return res.status(400).json({ message: 'This email or student id has been registered!' });

      await pool.query(
        `INSERT INTO Student (student_id, program_id, student_name, student_email, contact_no, password_hash, leave_balance,
         date_join, student_state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [student_id, program_id, name, email,contact_no, hashed, leave_balance, date_join, status]
      );
      return res.json({ message: 'student registered successfully' });
    }

    if (role === 'lecturer') {
      const [exists] = await pool.query('SELECT 1 FROM Lecturer WHERE lecturer_email = ?', [email]);
      if (exists.length) return res.status(400).json({ message: 'This email has been registered!' });

      await pool.query(
        `INSERT INTO Lecturer (program_id, lecturer_name, lecturer_email, contact_no, password_hash, date_join, lecturer_status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [program_id, name, email, contact_no, hashed, date_join, status]
      );
      return res.json({ message: 'lecturer registered successfully' });
    }

    return res.status(400).json({ message: 'unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}


exports.login = async (req, res) => {
  try {
    const { role, email, password } = req.body;
    console.log('req.body:', req.body);
    if (!role || !email || !password) return res.status(400).json({ message: 'please fill in all requirement!' });

    let sql, params;
    if (role === 'student') {
      sql = 'SELECT * FROM Student WHERE student_email = ?';
      params = [email];
    } else if (role === 'lecturer') {
      sql = 'SELECT * FROM Lecturer WHERE lecturer_email = ?';
      params = [email];
    } else if (role === 'hop') {
      sql = 'SELECT * FROM HOP WHERE hop_email = ?';
      params = [email];
    } else {
      return res.status(400).json({ message: 'unknown role' });
    }

    const [rows] = await pool.query(sql, params);
    if (!rows.length) return res.status(401).json({ message: 'user not exist' });

    const userRow = rows[0];
    const hashed = userRow.password_hash;
    const ok = await bcrypt.compare(password, hashed);
    if (!ok) return res.status(401).json({ message: 'user not exist or password incorrect' });

    const userInfo = pickUserRow(role, userRow);
    const token = jwt.sign({ id: userInfo.id, role: userInfo.role, email: userInfo.email, programId: userInfo.program }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.json({ message: 'login success', token, user: userInfo });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};
