const pool = require('../config/database.cjs');

exports.fetchSessionList = async (req, res) => {
  try {
    const { programId, role } = req.user
    console.log( programId, role )

    if (role !== 'hop') {
      return res.state(401).json({message:'you do not have permission.'});
    }

    // fetch session name list
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
    const { role } = req.user
    console.log( sessionName, role )

    if (role !== 'hop') {
      return res.state(401).json({message:'you do not have permission.'});
    }

    // get session id + session date (id for report fetch, date for session day calculation)
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
      (sessionEnd - sessionStart) // total micro seconds between end and start
      / (1000 * 60 * 60 * 24) // convert to days
    ) + 1; // include starting day

    // fetch student info, use student entity as base because student no apply for leave no session leave entity,
    // thus no predicted leave and current leave
    const [reportRows] = await pool.execute(`
      SELECT 
      st.student_id, st.student_name, st.student_email,
      
      -- check current leave if no use session leave balance
      COALESCE(sl.current_leave, s.leave_balance) AS current_leave,
    
      -- check predicted leave if no use session leave balance
      COALESCE(sl.predicted_leave, s.leave_balance) AS predicted_leave,
    
      -- if no final approved request, set to 0
      IFNULL(SUM(l.leave_days), 0) AS total_leave_days
      
      FROM Student st

      -- join session for session leave balance
      JOIN Session s ON s.session_id = ?
    
      -- join sessionlave for predicted leave and current leave
      LEFT JOIN SessionLeave sl ON st.student_id = sl.student_id AND sl.session_id = s.session_id
    
      -- jon leaverequest for total leave days calculation

      LEFT JOIN LeaveRequest l ON st.student_id = l.student_id AND l.session_id = s.session_id AND l.leave_status = 'final approved'

      WHERE st.program_id = s.program_id AND st.student_status = 'active'
                    
      GROUP BY st.student_id, st.student_name, st.student_email, sl.current_leave, sl.predicted_leave, s.leave_balance
    
      ORDER BY 
      st.student_name ASC;`,
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