const pool = require('../config/database.cjs');

exports.fetchSessionList = async (req, res) => {
  try {
    const { programId } = req.user

    console.log( programId )

    const [existingSessions] = await pool.execute(
      `SELECT session_name
         FROM Session
        WHERE program_id = ?
        ORDER BY session_id ASC`,
      [programId]
    );

    return res.json({existingSessions});
    
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchLeaveReport = async (req, res) => {
  try {
    const { sessionName } = req.body;

    // get session id + session date
    const [fetchSession] = await pool.execute(`
      SELECT session_id, starting_date, ending_date
      FROM Session
      WHERE session_name = ?`,
      [sessionName]
    );

    if (fetchSession.length === 0) {
      return res.json({ message: 'Session ID not found, fetch report failed!' });
    }

    const { session_id, starting_date, ending_date } = fetchSession[0];

    // calculate session day
    const sessionStart = new Date(starting_date);
    const sessionEnd = new Date(ending_date);
    const totalSessionDays = Math.floor(
      (sessionEnd - sessionStart) / (1000 * 60 * 60 * 24)
    ) + 1;

    // fetch student info
    const [reportRows] = await pool.execute(`
      SELECT 
        sl.student_id, st.student_name, st.student_email, sl.current_leave, sl.predicted_leave,
        IFNULL(SUM(l.leave_days), 0) AS total_leave_days
      FROM SessionLeave sl
      JOIN Student st 
      ON sl.student_id = st.student_id
      LEFT JOIN LeaveRequest l 
        ON sl.student_id = l.student_id 
        AND sl.session_id = l.session_id 
        AND l.leave_status = 'final approved'
      WHERE sl.session_id = ?
      GROUP BY 
        sl.student_id, st.student_name, st.student_email, sl.current_leave, sl.predicted_leave
      ORDER BY st.student_name ASC`,
      [session_id]
    );

    // calculate attendance rate
    const reportWithAttendance = reportRows.map(row => {
      const attendanceRate =
        totalSessionDays > 0 ? (((totalSessionDays - row.total_leave_days) / totalSessionDays) * 100).toFixed(2) : 0;
      return {
        ...row,
        attendance_rate: `${attendanceRate}%`
      };
    });

    let sessionLeaveDays = 'none';

    // fetch session leave balance
    const [sessionLeave] = await pool.execute(`
      SELECT leave_balance
      FROM Session
      WHERE session_id = ?`,
      [session_id]
    );

    // if no session found, set to 'none'
    if (sessionLeave.length === 0) {
      sessionLeaveDays = 'none';
    } else {
      sessionLeaveDays = sessionLeave[0].leave_balance;
    }

    console.log('session balance:', sessionLeaveDays)
    return res.json({ reportRows: reportWithAttendance, sessionLeaveDays });


  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};