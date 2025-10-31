const pool = require('../config/database.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email.cjs");

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES = '5h';

function pickUserRow(role, row, session_id, session_status) {
  if (!row) return null;
  if (role === 'student') {
    return {
      id: row.student_id,
      name: row.student_name,
      email: row.student_email,
      program: row.program_id,
      sessionId: session_id,
      sessionStatus: session_status,
      role: 'student'
    };
  }
  if (role === 'lecturer') {
    return {
      id: row.lecturer_id,
      name: row.lecturer_name,
      email: row.lecturer_email,
      program: row.program_id,
      sessionId: session_id,
      sessionStatus: session_status,
      role: 'lecturer'
    };
  }
  if (role === 'hop') {
    return {
      id: row.hop_id,
      name: row.hop_name,
      email: row.hop_email,
      program: row.program_id,
      sessionId: session_id,
      sessionStatus: session_status,
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
      return res.json({ message: 'Please fill in all the forms!' });
    }

    //^[^\s@]+      ：must have words in front of @，and cant have space or another @
    //@[^\s@]+      ：must have one @，and back cant have space or second @
    // //\.[^\s@]+$ ：must have . ，and must have words after it

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.json({ message: 'Invalid email format!' });
    }

    if (role === 'student' && !student_id) {
      return res.json({ message: 'Please fill in the student ID!' });
    }

    let program_id = null;
    if (program_name) {
      const [rows] = await pool.query(
        'SELECT program_id FROM Program WHERE program_name = ?',
        [program_name]
      );
      if (!rows.length) {
        return res.json({ message: 'Invalid program name!' });
      }
      program_id = rows[0].program_id;
    }

    const hashed = await bcrypt.hash(password, 10);

    if (role === 'student') {
      const [exists] = await pool.query('SELECT 1 FROM Student WHERE student_email = ? OR student_id = ?', [email , student_id]);
      if (exists.length) return res.json({ message: 'This email or student id has been registered!' });

      await pool.query(
        `INSERT INTO Student (student_id, program_id, student_name, student_email, contact_no, password_hash, leave_balance,
         date_join, student_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [student_id, program_id, name, email,contact_no, hashed, leave_balance, date_join, status]
      );
      return res.json({ message: 'student registered successfully! You may now wait for your account activation to login' , 
        successfully: true});
    }

    if (role === 'lecturer') {
      const [exists] = await pool.query('SELECT 1 FROM Lecturer WHERE lecturer_email = ?', [email]);
      if (exists.length) return res.json({ message: 'This email has been registered!' });

      await pool.query(
        `INSERT INTO Lecturer (program_id, lecturer_name, lecturer_email, contact_no, password_hash, date_join, lecturer_status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [program_id, name, email, contact_no, hashed, date_join, status]
      );
      return res.json({ message: 'lecturer registered successfully! You may now wait for your account activation to login' ,  
        successfully: true});
    }

    return res.status(400).json({ message: 'unknown role' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}

exports.userVerify = async (req, res) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) return res.json({ message: 'please fill in all requirement!' });

    // choose table
    let sql, params;
    if (role === 'student') sql = 'SELECT * FROM Student WHERE student_email = ?';
    else if (role === 'lecturer') sql = 'SELECT * FROM Lecturer WHERE lecturer_email = ?';
    else if (role === 'hop') sql = 'SELECT * FROM HOP WHERE hop_email = ?';
    else return res.status(400).json({ message: 'unknown role' });

    const [rows] = await pool.query(sql, [email]);
    if (!rows.length) return res.json({ message: 'user not exist!' });

    const userRow = rows[0];
    const userStatus = role === 'student' ? userRow.student_status : role === 'lecturer' ? userRow.lecturer_status : userRow.hop_status;
    if (userStatus === 'pending') return res.status(403).json({ message: 'Your account has not been activated yet, unable to login!' });

    const ok = await bcrypt.compare(password, userRow.password_hash);
    if (!ok) return res.status(401).json({ message: 'user not exist or password incorrect!' });

    // Invalidate previous OTPs for this user (prevent multiple valid OTPs)
    if (role === 'student') {
      await pool.execute(`UPDATE otpStudent SET otp_status = FALSE WHERE student_id = ?`, [userRow.student_id]);
    } else if (role === 'lecturer') {
      await pool.execute(`UPDATE otpLecturer SET otp_status = FALSE WHERE lecturer_id = ?`, [userRow.lecturer_id]);
    } else if (role === 'hop') {
      await pool.execute(`UPDATE otpHOP SET otp_status = FALSE WHERE hop_id = ?`, [userRow.hop_id]);
    }

    // Generate + save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let insertResult;
    if (role === 'student') {
      insertResult = await pool.execute(
        `INSERT INTO otpStudent (student_id, otp_code, otp_status, expires_at, created_at)
         VALUES (?, ?, TRUE, ?, NOW())`,
        [userRow.student_id, otp, expiresAt]
      );
    } else if (role === 'lecturer') {
      insertResult = await pool.execute(
        `INSERT INTO otpLecturer (lecturer_id, otp_code, otp_status, expires_at, created_at)
         VALUES (?, ?, TRUE, ?, NOW())`,
        [userRow.lecturer_id, otp, expiresAt]
      );
    } else {
      insertResult = await pool.execute(
        `INSERT INTO otpHOP (hop_id, otp_code, otp_status, expires_at, created_at)
         VALUES (?, ?, TRUE, ?, NOW())`,
        [userRow.hop_id, otp, expiresAt]
      );
    }

    // check insert success (mysql2 returns [result] from execute)
    const insertInfo = insertResult[0];
    if (!insertInfo || !insertInfo.insertId) {
      return res.status(500).json({ message: 'failed to save otp code to database!' });
    }

    // send email
    const recipientName = userRow.student_name || userRow.lecturer_name || userRow.hop_name || 'User';
    const html = `
      <h3>Login Verification Code</h3>
      <p>Dear ${recipientName},</p>
      <p>Your one-time password (OTP) for login is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 5 minutes.</p>
    `;
    await sendEmail(email, "Login Verification OTP", html);

    return res.json({ message: 'OTP sent to your email', successfully: true });
  } catch (err) {
    console.error('userVerify error:', err);
    return res.status(500).json({ message: 'server error' });
  }
};

exports.otpCodeCheck = async (req, res) => {
  try {
    const { role, email, otp } = req.body;
    if (!role || !email || !otp) return res.status(400).json({ message: 'role, email and otp are required' });

    // get user row
    let sql;
    if (role === 'student') sql = 'SELECT * FROM Student WHERE student_email = ?';
    else if (role === 'lecturer') sql = 'SELECT * FROM Lecturer WHERE lecturer_email = ?';
    else if (role === 'hop') sql = 'SELECT * FROM HOP WHERE hop_email = ?';
    else return res.status(400).json({ message: 'unknown role' });

    const [rows] = await pool.query(sql, [email]);
    if (!rows.length) return res.status(404).json({ message: 'user not exist!' });
    const userRow = rows[0];

    // find latest valid OTP
    if (role === 'student') {
      const [otpRows] = await pool.execute(
        `SELECT otp_stu_id, otp_code, expires_at FROM otpStudent
         WHERE student_id = ? AND otp_status = TRUE AND expires_at > NOW() AND otp_code = ?
         ORDER BY created_at DESC LIMIT 1`,
        [userRow.student_id, otp]
      );
      if (!otpRows.length) return res.json({ message: 'verification failed, wrong OTP or OTP not exist/expired!' });

      const otpId = otpRows[0].otp_stu_id;
      const [updateRes] = await pool.execute(`UPDATE otpStudent SET otp_status = FALSE WHERE otp_stu_id = ?`, [otpId]);
      // updateRes.affectedRows should be >0
      if (!updateRes || updateRes.affectedRows === 0) return res.status(500).json({ message: 'falsing otp failed!' });

    } else if (role === 'lecturer') {
      const [otpRows] = await pool.execute(
        `SELECT otp_lec_id, otp_code, expires_at FROM otpLecturer
         WHERE lecturer_id = ? AND otp_status = TRUE AND expires_at > NOW() AND otp_code = ?
         ORDER BY created_at DESC LIMIT 1`,
        [userRow.lecturer_id, otp]
      );
      if (!otpRows.length) return res.json({ message: 'verification failed, wrong OTP or OTP not exist/expired!' });

      const otpId = otpRows[0].otp_lec_id;
      const [updateRes] = await pool.execute(`UPDATE otpLecturer SET otp_status = FALSE WHERE otp_lec_id = ?`, [otpId]);
      if (!updateRes || updateRes.affectedRows === 0) return res.status(500).json({ message: 'falsing otp failed!' });

    } else {
      // hop
      const [otpRows] = await pool.execute(
        `SELECT otp_hop_id, otp_code, expires_at FROM otpHOP
         WHERE hop_id = ? AND otp_status = TRUE AND expires_at > NOW() AND otp_code = ?
         ORDER BY created_at DESC LIMIT 1`,
        [userRow.hop_id, otp]
      );
      if (!otpRows.length) return res.json({ message: 'verification failed, wrong OTP or OTP not exist/expired!' });

      const otpId = otpRows[0].otp_hop_id;
      const [updateRes] = await pool.execute(`UPDATE otpHOP SET otp_status = FALSE WHERE otp_hop_id = ?`, [otpId]);
      if (!updateRes || updateRes.affectedRows === 0) return res.status(500).json({ message: 'falsing otp failed!' });
    }

    return res.json({ message: 'verification complete, proceed to log in', successfully: true });
  } catch (err) {
    console.error('otpCodeCheck error:', err);
    return res.status(500).json({ message: 'server error' });
  }
};

exports.userlogin = async (req, res) => {
  try {
    const { role, email } = req.body;
    if (!role || !email) return res.status(400).json({ message: 'role or email is missing!' });

    let sql;
    if (role === 'student') sql = 'SELECT * FROM Student WHERE student_email = ?';
    else if (role === 'lecturer') sql = 'SELECT * FROM Lecturer WHERE lecturer_email = ?';
    else if (role === 'hop') sql = 'SELECT * FROM HOP WHERE hop_email = ?';
    else return res.status(400).json({ message: 'unknown role' });

    const [rows] = await pool.query(sql, [email]);
    if (!rows.length) return res.status(404).json({ message: 'user not exist!' });

    const userRow = rows[0];
    const programId = userRow.program_id;

    const [sessionRow] = await pool.execute(
      `SELECT session_id, session_status FROM Session
       WHERE session_status IN ('unactivated','activated') AND program_id = ?
       ORDER BY starting_date ASC LIMIT 1`,
      [programId]
    );

    let session_id = 'none', session_status = 'none';
    if (sessionRow.length) {
      ({ session_id, session_status } = sessionRow[0]);
    }

    const userInfo = pickUserRow(role, userRow, session_id, session_status);
    const token = jwt.sign(
      { id: userInfo.id, role: userInfo.role, email: userInfo.email, programId: userInfo.program, 
        sessionId: userInfo.sessionId, sessionStatus: userInfo.sessionStatus },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({ message: `login success! welcome user ${userInfo.name}`, token, user: userInfo, successfully: true });
  } catch (err) {
    console.error('userlogin error:', err);
    return res.status(500).json({ message: 'server error' });
  }
};