const pool = require('../config/database.cjs');

// for student own only
exports.fetchOwnStudentLeaveRequest = async (req, res) => {
  try {
    const { id, sessionId, role } = req.user; // got student id can directly fetch

    if (sessionId === 'none'){
      return;
    }

    if (role !== 'student') {
      return;
    }

    // fetch student own requests
    const [rows] = await pool.execute(
      `SELECT leave_id, leave_date, end_date, leave_name, leave_type, leave_status, submission_date
        FROM LeaveRequest
        WHERE student_id = ? AND session_id = ?
        ORDER BY leave_id ASC`,
        [id, sessionId]
    );

    // no matter got result or not return it
    return res.json({ rows, successfully:true });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// fetch all request from a program
exports.fetchStudentLeaveRequest = async (req, res) => {
  try {
    const { id, role, programId, sessionId } = req.user;

    if (sessionId === 'none'){
      return;
    }

    if (role !== 'lecturer' && role !== 'hop') {
      return;
    }

    // join lecturerApproval to make sure only fetch request that send to the lecturer
    if (role === 'lecturer') {
      const [rows] = await pool.execute(
      `SELECT lr.leave_id, lr.leave_date, lr.end_date, lr.leave_name, lr.leave_type, lr.leave_status, lr.submission_date
        FROM LeaveRequest lr
        JOIN LecturerApproval la ON lr.leave_id = la.leave_id
        WHERE lecturer_id = ? AND lr.session_id = ?
        ORDER BY leave_id ASC`,
        [id, sessionId]
      );

      // no matter got result or not return it
      return res.json({ rows, successfully:true });

    } else if (role === 'hop') {
      const [rows] = await pool.execute(
      `SELECT lr.leave_id, lr.leave_date, lr.end_date, lr.leave_name, lr.leave_type, lr.leave_status, lr.submission_date
        FROM LeaveRequest lr
        JOIN session s ON lr.session_id = s.session_id
        WHERE s.program_id = ? AND lr.session_id = ?
        ORDER BY leave_id ASC`,
        [programId, sessionId]
      );

      // no matter got result or not return it
      console.log('found records', rows)
      return res.json({ rows, successfully:true });
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}