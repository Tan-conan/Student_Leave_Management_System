const pool = require('../config/database.cjs');

exports.createSession = async (req, res) => {
  try {
    const { sessionName, sessionStartDate, sessionEndDate, programID } = req.body;

    const informationMessage = 'data received, sessionName: ' + sessionName + ' ,sessionDate: ' + sessionStartDate + 
      ' ,sessionEndDate:' + sessionEndDate + ' ,programID: ' + programID;

    console.log(informationMessage)

    if (!sessionName || !sessionStartDate || !sessionEndDate || !programID) {
      return res.status(400).json({ message: 'some data is missing!' });
    }

    const [existingSessions] = await pool.execute(
      `SELECT session_id, session_name, starting_date, ending_date, session_status
         FROM Session
        WHERE program_id = ?`,
      [programID]
    );

    const unactivatedSession = existingSessions.find(row => {
      const status = row.session_status

      return (status === 'unactivated' || status === 'activated');
    });

    // stop inserting if got unactivated session
    if(unactivatedSession) {
      return res.status(409).json({
        message: `There is a existed unactivated/activated session ${unactivatedSession.session_name}, 
        you are unable to start a new session until this session ends!`
      });
    }

    // find overlap if exist stop inserting session
    const overlap = existingSessions.find(row => {
      const start = new Date(row.starting_date);
      const end   = new Date(row.ending_date);

      return (new Date(sessionStartDate) <= end) && (new Date(sessionEndDate) >= start);
    });

    if (overlap) {
      return res.status(409).json({
        message: `Date range conflicts with existing session ${overlap.session_name}!`
      });
    }

    await pool.execute(
      `INSERT INTO Session (program_id, session_name, starting_date, ending_date, session_status)
       VALUES (?, ?, ?, ?, ?)`,
      [programID, sessionName, sessionStartDate, sessionEndDate, 'unactivated']
    );

    res.json({
      message: `Session "${sessionName}" created successfully, it will starts when the time reached.`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};


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