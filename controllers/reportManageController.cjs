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
    const { sessionName } = req.body

    console.log( sessionName )

    const [fetchSessionId] = await pool.execute(`
      SELECT session_id
      FROM Session
      WHERE session_name = ?`,
      [sessionName]
    );

    if (fetchSessionId.length === 0) {
      return res,json({message:'session Id not found, fetch report failed!'})
    }
    
    const [reportRows] = await pool.execute(`
      SELECT sl.student_id, st.student_name, sl.current_leave, sl.predicted_leave, st.student_email,
        COUNT(l.leave_id) AS leave_count
      FROM SessionLeave sl
      JOIN Student st ON sl.student_id = st.student_id
      LEFT JOIN LeaveRequest l 
        ON sl.student_id = l.student_id 
        AND sl.session_id = l.session_id
      WHERE sl.session_id = ?
      GROUP BY sl.student_id, st.student_name, st.student_email, sl.current_leave, sl.predicted_leave
      ORDER BY st.student_name ASC`, 
      [fetchSessionId[0].session_id]
    );

    return res.json({reportRows});
    
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}