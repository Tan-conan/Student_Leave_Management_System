const pool = require('../config/database.cjs');

// check and update session state in time
async function sessionManagement() {
  try {
    //auto start a unactivated session
    await pool.execute(
      `UPDATE Session
      SET session_status = 'activated' 
      WHERE session_status = 'unactivated'
      AND starting_date <= CURDATE()
      AND ending_date   >= CURDATE()`
    );

    //auto end a activated session
    await pool.execute(
      `UPDATE Session
      SET session_status = 'ended' 
      WHERE session_status = 'activated'
      AND ending_date   < CURDATE()`
    );

  } catch (err) {
    console.error('Error managing sessions status:', err);
  }
}

sessionManagement();
setInterval(() => {
  console.log('[Timer] Running session management job...');
  sessionManagement();
}, 60 * 60 * 1000);

exports.sessionChecker = async (req, res) => {
  try {
    const { programId, sessionId } = req.body;
    console.log('user programId will be ', programId )
    console.log('user old session id will be ', sessionId )

    let session_id, session_status;

    // for users that currently dont have activated/unactivated session
    if (sessionId === 'none') {
      const [sessionRow] = await pool.execute(
      `SELECT session_id, session_status
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND program_id = ?`,
        [programId]
    );

    // if no record means still no activated/unactivated session , return with session state of none
    if (sessionRow.length === 0) {
      session_id = 'none';
      session_status = 'none';
    } else { // else return with new session and its session state
      ({ session_id, session_status } = sessionRow[0]);
    }
    
    } else {
      // for users that currently has activated/unactivated session, recheck their session state
      const [sessionCheck] = await pool.execute(
      `SELECT session_id, session_status
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND session_id = ?`,
        [sessionId]
    );

    // if no record means session ends, return with session state of ended
    if (sessionCheck.length === 0) {
      session_id = 'none';
      session_status = 'ended';
    } else { // else update that session state
      ({ session_id, session_status } = sessionCheck[0]);
    }

    }

    // set all assign into false if no activated/unactivated session
    if (session_status === 'none') {

      await pool.execute(
        `UPDATE CourseAssignment ca
         JOIN Course c ON ca.course_id = c.course_id
         SET ca.assign_status = FALSE
         WHERE c.program_id = ? AND ca.assign_status = TRUE`,
        [programId]
      );
    }

    console.log('session id sended will be ', session_id )
    console.log('session_status sended will be ', session_status )

    return res.json({ session_id: session_id, session_status: session_status });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}