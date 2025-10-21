const pool = require('../config/database.cjs');
const sendEmail = require("../utils/email.cjs");


exports.fetchLecturersList = async (req, res) => {
  try {
    const { programId:programID } = req.user;

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
    const { lecturer_id, remark } = req.body;
    console.log( lecturer_id, remark)

    // find lecturer email
    const [lecturer] = await pool.execute( 
      `SELECT lecturer_email FROM Lecturer WHERE lecturer_id = ?`,
      [lecturer_id]
    );
    
    // if got send email
    if (lecturer.length > 0) {
      const lecturerEmail = lecturer[0].lecturer_email;
      
      const html = `
      <h3>Account Registration Approved</h3>
      <p>Dear Lecturer,</p>
      <p>Your account registration has been <b>Approved</b> by the Head of Programme.</p>
      <p>Reason: ${remark}</p>
      <p>You are now able to login using the registered account.</p>
      `;

    await sendEmail(lecturerEmail, "Account Registration Approved", html);

    console.log('Approve email sent.')
    } else {
      console.log('find lecturer email failed, will approve the account directly.')
    }

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
    const { lecturer_id, remark } = req.body;
    console.log( lecturer_id, remark)

    // find lecturer email
    const [lecturer] = await pool.execute( 
      `SELECT lecturer_email FROM Lecturer WHERE lecturer_id = ?`,
      [lecturer_id]
    );
    
    // if got send email
    if (lecturer.length > 0) {
      const lecturerEmail = lecturer[0].lecturer_email;
      
      const html = `
      <h3>Account Registration Rejected</h3>
      <p>Dear Lecturer,</p>
      <p>Your account registration has been <b>rejected</b> by the Head of Programme.</p>
      <p>Reason: ${remark}</p>
      <p>If you believe this was a mistake, please contact your programme office.</p>
      `;

    await sendEmail(lecturerEmail, "Account Registration Rejected", html);

    console.log('Rejection email sent.')
    } else {
      console.log('find lecturer email failed, will delete the account directly.')
    }

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