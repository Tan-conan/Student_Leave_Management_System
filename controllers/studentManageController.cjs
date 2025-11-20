const pool = require('../config/database.cjs');
const sendEmail = require("../utils/email.cjs");

exports.fetchStudentsList = async (req, res) => {
  try {
    const { programId:programID, role } = req.user;

    if (role !== 'hop') {
      return res.status(401).json({message: 'student fetch failed, not hop role'})
    }

    // fetch student info
    const [rows] = await pool.execute(
      `SELECT student_id, student_name, student_status, date_join, student_email, contact_no
        FROM Student
        WHERE program_id = ?
        ORDER BY student_id ASC`,
        [programID]
    );

    if (rows.length === 0) {
      console.log('no student found, return immedietaly')
      return;
    }

    res.json({ students: rows });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.approveStudent = async (req, res) => {
  try {
    const { student_id, remark } = req.body;
    const {role} = req.user;
    console.log( student_id, remark)

    if (role !== 'hop') {
      return res.json({ message: 'You do not have permission to do this!' });
    }

    // find student email
    const [student] = await pool.execute( 
      `SELECT student_email FROM Student WHERE student_id = ?`,
      [student_id]
    );
    
    // if got send email
    if (student.length > 0) {
      const studentEmail = student[0].student_email;
      
      const html = `
      <h3>Account Registration Approved</h3>
      <p>Dear Student,</p>
      <p>Your account registration has been <b>Approved</b> by the Head of Programme.</p>
      <p>Reason: ${remark}</p>
      <p>You are now able to login using the registered account.</p>
      `;

    await sendEmail(studentEmail, "Account Registration Approved", html);

    console.log('Approve email sent.')
    } else {
      console.log('find student email failed, will approve the account directly.')
    }

    // update student status into active
    const [updateresult] = await pool.execute(
      `UPDATE Student
      SET student_status = 'active'
      WHERE student_id = ?`,
        [student_id]
    );

    if (updateresult.affectedRows === 0) {
      return res.status(404).json({ message: 'update failed!' });
    }

    res.json({ message: 'student approved succesfully! now the student account will be active.' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteStudent = async (req, res) => {
  try {
    const { student_id, remark } = req.body;
    const {role} = req.user;

    if (role !== 'hop') {
      return res.json({ message: 'You do not have permission to do this!' });
    }

    // find student email
    const [student] = await pool.execute( 
      `SELECT student_email FROM Student WHERE student_id = ?`,
      [student_id]
    );
    
    // if got send email
    if (student.length > 0) {
      const studentEmail = student[0].student_email;
      
      const html = `
      <h3>Account Registration Rejected</h3>
      <p>Dear Student,</p>
      <p>Your account registration has been <b>Rejected</b> by the Head of Programme.</p>
      <p>Reason: ${remark}</p>
      <p>If you believe this was a mistake, please contact your programme office.</p>
      `;

    await sendEmail(studentEmail, "Account Registration Rejected", html);

    console.log('Rejected email sent.')
    } else {
      console.log('find student email failed, will reject the account directly.')
    }

    // delete student
    const [deleteResult]  = await pool.execute(
      `DELETE FROM Student
       WHERE student_id = ?`,
      [student_id]
    );

    if (deleteResult.affectedRows > 0) {
      return res.json({ message: 'Student rejected successfully! Now the account will be deleted' });
    } else {
        return res.json({ message: 'Student rejected failed!' });
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};