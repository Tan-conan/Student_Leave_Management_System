const pool = require('../config/database.cjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '';


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
    // get information from token 
    const { programId, sessionId: oldSessionId, id, role, email, sessionStatus: oldSessionStatus } = req.user;
    let session_name;

    console.log('User programId:', programId);
    console.log('User old sessionId:', oldSessionId);

    let session_id, session_status;

    // if now user no session
    if (oldSessionId === 'none') {
      const [sessionRow] = await pool.execute(
        `SELECT session_id, session_status, session_name
         FROM Session
         WHERE session_status IN ('unactivated', 'activated')
         AND program_id = ?`,
        [programId]
      );

      if (sessionRow.length === 0) {
        session_id = 'none';
        session_status = 'none';
        session_name = 'none';
      } else {
        ({ session_id, session_status, session_name } = sessionRow[0]);
      }

    } else {
      // got session, check status again
      const [sessionCheck] = await pool.execute(
        `SELECT session_id, session_status, session_name
         FROM Session
         WHERE session_status IN ('unactivated', 'activated')
         AND session_id = ?`,
        [oldSessionId]
      );

      if (sessionCheck.length === 0) {
        session_id = 'none';
        session_status = 'ended';
        session_name = 'none;'
      } else {
        ({ session_id, session_status, session_name } = sessionCheck[0]);
      }
    }

    console.log('Session after check:', { session_id, session_status, session_name });

    // check needs to update jwt token or not
    if (oldSessionId !== session_id || oldSessionStatus !== session_status) {
      const newPayload = {
        id,
        role,
        email,
        programId,
        sessionId: session_id,
        sessionStatus: session_status
      };

      const newToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: '5h' });

      return res.json({ 
        updated: true,
        message: 'Session state updated, new token issued',
        session_id,
        session_status,
        session_name,
        token: newToken
      });
    }

    // no update jwt
    return res.json({
      updated: false,
      message: 'Session state unchanged',
      session_id,
      session_status,
      session_name
    });

  } catch (err) {
    console.error('Session check error:', err.message);

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    return res.status(500).json({ message: 'Server error during session check' });
  }
};