const pool = require('../config/database.cjs');

exports.fetchCurrentSession = async (req, res) => {
  try {
    const { programId } = req.user;

    const [rows] = await pool.execute(
      `SELECT session_id, session_name, starting_date, ending_date, session_status
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND program_id = ?
        ORDER BY starting_date ASC`,
        [programId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No active/unactivated session found' });
    }

    res.json({ session: rows });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.createSession = async (req, res) => {
  try {
    const { sessionName, sessionStartDate, sessionEndDate, sessionLeaveBalance } = req.body;
    const programID = req.user.programId
    const id = req.user.id

    if (id !== 'hop') {
      return res.json({ message: 'Warning: You do not have Permission to do this!' });
    }

    const informationMessage = 'data received, sessionName: ' + sessionName + ' ,sessionDate: ' + sessionStartDate + 
      ' ,sessionEndDate:' + sessionEndDate + ' ,programID: ' + programID + 'leave balance' + sessionLeaveBalance;

    console.log(informationMessage)

    if (!sessionName || !sessionStartDate || !sessionEndDate || !programID) {
      return res.json({ message: 'some data is missing!' });
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
      return res.json({
        message: `There is a existed unactivated/activated session ${unactivatedSession.session_name}, 
        you are unable to start a new session until this session ends!`
      });
    }

    for (const row of existingSessions) {
      if (row.session_name === sessionName) {
        return res.json({
          message: `This session name "${sessionName}" already taken by another session!`
        });
      }
    }

    // find overlap if exist stop inserting session
    const overlap = existingSessions.find(row => {
      const start = new Date(row.starting_date);
      const end   = new Date(row.ending_date);
      const newStart = new Date(sessionStartDate);
      const newEnd = new Date(sessionEndDate);
      
      // set the hours of end date into last moment
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      newStart.setHours(0, 0, 0, 0);
      newEnd.setHours(23, 59, 59, 999);
      
      console.log('inserting new session start date:' + newStart)
      console.log('inserting new session end date:' + newEnd)
      console.log('exsiting session start date:' + start)
      console.log('exsiting session end date:' + end)
      
      return newStart <= end && newEnd >= start;
});

    if (overlap) {
      return res.json({
        message: `Date range conflicts with existing session ${overlap.session_name}!`
      });
    }

    // new session cannot earlier than today
    const today = new Date();
    const startDate = new Date(sessionStartDate);
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      return res.json({
        message: 'Session start date cannot be earlier than today!'
      });
    }

    await pool.execute(
      `INSERT INTO Session (program_id, session_name, starting_date, ending_date, session_status, leave_balance)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [programID, sessionName, sessionStartDate, sessionEndDate, 'unactivated', sessionLeaveBalance]
    );

    res.json({
      message: `Session "${sessionName}" created successfully, it will starts when the time reached.`, successfully:true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.fetchHolidays = async (req, res) => {
  try {
    const { sessionId } = req.user;

    const [rows] = await pool.execute(
      `SELECT session_id, session_name, starting_date, ending_date, session_status
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND session_id = ?
        ORDER BY starting_date ASC`,
        [sessionId]
    );

    if(rows.length === 0) return res.json({holidays:[]});

    const [holidays] = await pool.execute(
      `SELECT holiday_id, holiday_name, starting_date, ending_date
        FROM Holiday
        WHERE session_id = ?
        ORDER BY created_at ASC`,
        [sessionId]
    );

    res.json({holidays})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' , sessionState});
  }
};

exports.addHoliday = async (req, res) => {
  try {
    const { holidayName, holidayStartDate, holidayEndDate } = req.body;
    const { programId:programID } = req.user;

    console.log(programID, holidayName, holidayStartDate, holidayEndDate)

    //find session
    const [rows] = await pool.execute(
      `SELECT session_id, session_name, starting_date, ending_date
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND program_id = ?
        ORDER BY starting_date ASC`,
        [programID]
    );

    if (rows.length === 0) {
      return res.json({ message: 'You cant add a holiday when no session available!' });
    }

    const session = rows[0];
    const sessionID = session.session_id;

    const sessionStart = new Date(session.starting_date);
    const sessionEnd = new Date(session.ending_date);
    const holidayStart = new Date(holidayStartDate);
    const holidayEnd = new Date(holidayEndDate);

    sessionStart.setHours(0, 0, 0, 0);
    sessionEnd.setHours(23, 59, 59, 999);
    holidayStart.setHours(0, 0, 0, 0);
    holidayEnd.setHours(23, 59, 59, 999);

    // check holiday range in session or not
    if (holidayStart < sessionStart || holidayEnd > sessionEnd) {
      return res.json({
        message: `Holiday dates must be within the current session range!`
      });
    }

    //check overlap
    const [overlap] = await pool.execute(
      `SELECT holiday_id, holiday_name, starting_date, ending_date
       FROM Holiday
       WHERE session_id = ?
       AND ( ? <= ending_date AND ? >= starting_date )`,
      [sessionID, holidayStartDate, holidayEndDate]
    );

    if (overlap.length > 0) {
      return res.json({ message: `Holiday "${holidayName}" overlaps with existing holiday 
        "${overlap[0].holiday_name}"!` });
    }

    //add holiday
    await pool.execute(
      `INSERT INTO Holiday (session_id, holiday_name, starting_date, ending_date)
       VALUES (?, ?, ?, ?)`,
      [sessionID, holidayName, holidayStartDate, holidayEndDate]
    );

    res.json({ message: 'holiday add complete!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.editHoliday = async (req, res) => {
  try {
    const { holidayId, holidayName, holidayStartDate, holidayEndDate} = req.body;
    const programID = req.user.programId;

    console.log(programID, holidayId, holidayName, holidayStartDate, holidayEndDate);

    //check holiday availablility
    const [rows] = await pool.execute(
      `SELECT holiday_id, session_id FROM Holiday WHERE holiday_id = ?`,
      [holidayId]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Holiday not found!' });
    }

    //get current session
    const [currentSession] = await pool.execute(
      `SELECT session_id, session_name, starting_date, ending_date
        FROM Session
        WHERE session_status IN ('unactivated','activated')
        AND program_id = ?
        ORDER BY starting_date ASC`,
        [programID]
    );

    if (currentSession.length === 0) {
      return res.json({ message: 'You cant edit a holiday when no session available!' });
    }

    const session = currentSession[0];
    const sessionID = session.session_id;

    const sessionStart = new Date(session.starting_date);
    const sessionEnd = new Date(session.ending_date);
    const holidayStart = new Date(holidayStartDate);
    const holidayEnd = new Date(holidayEndDate);
    const today = new Date();

    holidayStart.setHours(0,0,0,0);
    holidayEnd.setHours(23, 59, 59, 999);
    sessionStart.setHours(0,0,0,0);
    sessionEnd.setHours(23, 59, 59, 999);
    today.setHours(0,0,0,0);

    // check holiday startdate cannot be earlier or ongoing
    if (holidayStart <= today) {
      return res.json({ message: 'You cannot edit a holiday that has already started or is starting today!' });
    }

    // check holiday range in session or not
    if (holidayStart < sessionStart || holidayEnd > sessionEnd) {
      return res.json({
        message: `Holiday dates must be within the current session range!`
      });
    }

    //check date overlap
    const [overlap] = await pool.execute(
      `SELECT holiday_id, holiday_name, starting_date, ending_date
       FROM Holiday
       WHERE session_id = ?
       AND holiday_id <> ?
       AND ( ? <= ending_date AND ? >= starting_date )`,
      [sessionID, holidayId, holidayStartDate, holidayEndDate]
    );

    if (overlap.length > 0) {
      return res.json({ message: `Holiday "${holidayName}" overlaps with existing holiday 
        "${overlap[0].holiday_name}"!` });
    }

    //update holiday
    await pool.execute(
      `UPDATE Holiday
       SET holiday_name = ?, starting_date = ?, ending_date = ?
       WHERE holiday_id = ?`,
      [holidayName, holidayStartDate, holidayEndDate, holidayId]
    );

    res.json({ message: 'holiday edit complete!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    const { holidayId } = req.body;

    console.log('Delete holidayId:', holidayId);

    if (!holidayId) {
      return res.status(400).json({ message: 'Holiday ID is required!' });
    }

    // check holiday
    const [rows] = await pool.execute(
      `SELECT holiday_id, holiday_name, starting_date FROM Holiday WHERE holiday_id = ?`,
      [holidayId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Holiday not found!' });
    }

    const holidayStartDate = new Date(rows[0].starting_date)
    const today = new Date();

    holidayStartDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    // check holiday startdate cannot be earlier or ongoing
    if (holidayStartDate <= today) {
      return res.json({ message: 'You cannot delete a holiday that has already started or is starting today!' });
    }

    const holidayName = rows[0].holiday_name;

    // delete holiday
    await pool.execute(
      `DELETE FROM Holiday WHERE holiday_id = ?`,
      [holidayId]
    );

    res.json({ message: `Holiday "${holidayName}" deleted successfully!` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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