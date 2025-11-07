const pool = require('../config/database.cjs');
const sendEmail = require("../utils/email.cjs");

// check student leave date range is valid or not
exports.dateRangeValidation = async (req, res) => {
  try {
    const { sessionId, sessionStatus } = req.user;
    const { startDate, endDate } = req.body
    console.log( sessionId, sessionStatus, startDate, endDate )

    // fecthing session date range
    const [sessionResult] = await pool.execute(
      `SELECT starting_date, ending_date 
       FROM Session
       WHERE session_id = ? AND session_status = 'activated'`,
      [sessionId]
    );

    if (sessionResult.length === 0) {
      return res.json({ message: 'Session not found or session is not ongoing!', 
        invalidDay:'error: Session not found or session is not ongoing'});
    }

    const sessionStart = new Date(sessionResult[0].starting_date);
    const sessionEnd = new Date(sessionResult[0].ending_date);
    const leaveStart = new Date(startDate);
    const leaveEnd = new Date(endDate);

    // if out of session range, directly return
    if (leaveStart < sessionStart || leaveEnd > sessionEnd) {
      return res.json({
        message: `Leave range (${startDate} to ${endDate}) is outside the session period 
        (${sessionResult[0].starting_date} to ${sessionResult[0].ending_date})!`, invalidDay:'error: leave date out of session'});
    }
    console.log('date checked, valid leave range, now performing valid leave day calculation....')

    // calculate date in selected range
    const allDates = [];
    for (let d = new Date(leaveStart); d <= leaveEnd; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    // remove saturday and sunday
    let workingDays = allDates.filter(d => {
      const day = d.getDay();
      return day !== 0 && day !== 6;
    });

    // fetch all current session holidays
    const [holidays] = await pool.execute(
      `SELECT starting_date, ending_date FROM Holiday WHERE session_id = ?`,
      [sessionId]
    );

    // remove days if affect with holidays
    if (holidays.length > 0) {
      for (const holiday of holidays) {
        const holidayStart = new Date(holiday.starting_date);
        const holidayEnd = new Date(holiday.ending_date);

        workingDays = workingDays.filter(d => {
          return d < holidayStart || d > holidayEnd;
        });
      }
    }

    // final valid leave days
    const validLeaveDay = workingDays.length;

    res.json({ message: 'Effective leave days calculated successfully', successfully: true, validLeaveDay });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.sendRequest = async (req, res) => {
  try {
    const { sessionId, sessionStatus, id, programId } = req.user;
    const { requestName, requestStartDate, requestEndDate, requestType, leaveReason, 
      requestValidLeaveDay, selectedCourses } = req.body
    console.log(requestName, requestStartDate, requestEndDate, requestType, leaveReason)

    // unable to send request when no session ongoing
    if (sessionStatus !== 'activated') {
      return res.json({message: 'Unable to send record when no session ongoing!'});
    }

    if (requestValidLeaveDay === 0 ) {
      return res.json({message: 'The leave day cannot be 0!'});
    }

    if (selectedCourses.length === 0) {
      return res.json({message: 'no lecturer choosen to send!'});
    }

    const currentDate = new Date().toLocaleDateString('en-CA')

    if (new Date(requestStartDate) < new Date(currentDate)) {
      return res.json({message: 'Leave start date cannot be earlier than today!'});
    }

    // check the leave date range collides with others or not
    const [overlapCheck] = await pool.execute(
      `SELECT leave_id, leave_name, leave_date, end_date
       FROM LeaveRequest
       WHERE student_id = ?
       AND session_id = ?
       AND ((? <= end_date AND ? >= leave_date))`,
      [id, sessionId, requestStartDate, requestEndDate]
    );

    if (overlapCheck.length > 0) {
      return res.json({
        message: `The requested leave overlaps with an existing leave (${overlapCheck[0].leave_name}: 
        ${new Date(overlapCheck[0].leave_date).toLocaleDateString('en-CA')} to ${new Date(overlapCheck[0].end_date).toLocaleDateString('en-CA')}).`,
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO leaveRequest (student_id, session_id, leave_name, leave_date, end_date, leave_days, leave_type, 
      leave_reason, leave_status, submission_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, sessionId, requestName, requestStartDate, requestEndDate, requestValidLeaveDay, requestType, leaveReason,
        'pending', currentDate]
    )

    if (result.affectedRows === 0) {
      return res.json({message: 'insert failed or no rows matched'});
    } 

    // decrease the value of predicted leave balance, negative leave balance is allowed to let lecturers 
    // and hop view the over request of leave of the student
    const [leaveResult] = await pool.execute(
      `UPDATE SessionLeave
      SET predicted_leave = predicted_leave - ?
      WHERE student_id = ? AND session_id = ?`,
      [requestValidLeaveDay, id, sessionId]
    )

    if (leaveResult.affectedRows === 0) {
      return res.json({message: 'missing predicted balance failed or no rows matched'});
    }

    // find student name
    const [fetchStudentName] = await pool.execute(
      `SELECT student_name
       FROM Student
       WHERE student_id = ?`,
      [id]
    );

    let studentName = ''

    if (fetchStudentName.length > 0) {
      studentName = fetchStudentName[0].student_name
    }

    // adding lecturer approve rows for the leave
    for (const lec of selectedCourses) {
      console.log('lecturer_id', lec.id)
      console.log('result.leave_id', result.leave_id)
      console.log('currentdate', currentDate)
      await pool.execute( // same lecturer id on same leave request will directly skip due to unique key
        `INSERT IGNORE INTO LecturerApproval (leave_id, lecturer_id, approve_status)
         VALUES (?, ?, ?)`,
        [result.insertId, lec.id, 'pending'] //result.insertId is id mysql auto creates for leave_id
      );

      // find lecturer email
      const [lecturerEmail] = await pool.execute( // same lecturer id on same leave request will directly skip due to unique key
        `SELECT lecturer_email, lecturer_name FROM Lecturer WHERE lecturer_id = ?`,
        [lec.id]
      );

      if (lecturerEmail.length > 0) {
        // send notification email to lecturer
        const html = `
        <h3>New student leave request</h3>
        <p>Dear Lecturer ${lecturerEmail[0].lecturer_name},</p>
        <p>A new request <b> ${requestName} </b> from student <b> ${studentName} </b> has been send to the Havabreak.</p>
        <p>You may log in HavaBreak to look for the new leave request.</p>
        `;

        await sendEmail(lecturerEmail[0].lecturer_email, "New student leave request", html);

        console.log('email send to ' + lecturerEmail[0].lecturer_email + '.')
      }
    }

    // find hop email
    const [hopEmail] = await pool.execute( // same lecturer id on same leave request will directly skip due to unique key
      `SELECT hop_email, hop_name 
      FROM Hop
      WHERE program_id = ?`,
      [programId]
    );

    if (hopEmail.length > 0) {
      // send notification email to hop
      const html = `
      <h3>New student leave request</h3>
      <p>Dear Head of Program ${hopEmail[0].hop_name},</p>
      <p>A new request <b> ${requestName} </b> from student <b> ${studentName} </b> has been send to the Havabreak.</p>
      <p>You may log in HavaBreak to look for the new leave request.</p>
      `; 
      await sendEmail(hopEmail[0].hop_email, "New student leave request", html);

      console.log('email send to ' + hopEmail[0].hop_email + '.')
    }

    return res.json({message: 'Submitted successfully', successfully:true, leaveId: result.insertId})

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.findSessionRange = async (req, res) => {
  try {
    const { sessionId, sessionStatus } = req.user;
    console.log( sessionId, sessionStatus )

    let sessionStartDate = null;
    let sessionEndDate = null;
    let sessionName = null;

    if (sessionStatus !== 'activated') {
      return res.json({sessionStartDate, sessionEndDate, sessionName});
    }

    const [sessionResult] = await pool.execute(
      `SELECT starting_date, ending_date, session_name
       FROM Session
       WHERE session_id = ? AND session_status = 'activated'`,
      [sessionId]
    );

    if (sessionResult.length === 0) {
      return res.json({ sessionStartDate, sessionEndDate, sessionName });
    }

    sessionStartDate = sessionResult[0].starting_date
    sessionEndDate = sessionResult[0].ending_date
    sessionName = sessionResult[0].session_name

    return res.json({sessionStartDate, sessionEndDate, sessionName})

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.checkStudentLeaveBalance = async (req, res) => {
  try {
    const { id, sessionId } = req.user;
    console.log( id, sessionId )

    let leaveBalance = null;
    let predictedLeave = null;
    let validLeaveDay = null;

    // no session leave balance all none
    if (sessionId === 'none') {
        leaveBalance = 'Unavailable'
        predictedLeave = 'Unavailable when no session'
        validLeaveDay = 'Unavailable when no session'
        return res.json({ currentLeave: leaveBalance, predictedLeave, validLeaveDay, successfully:true});
    } else {
      // check current student in this session got session leave record or not
        const [leaveRecord] = await pool.execute(
            `SELECT session_leave_id
            FROM sessionLeave
            WHERE student_id = ? and session_id = ?`,
            [id, sessionId]
        )

        // if no create sessionleave for this student, initialize the leave balance
        if (leaveRecord.length === 0) {
          const [leave_Balance] = await pool.execute(
            `SELECT leave_balance
            FROM session
            WHERE session_id = ?`,
            [sessionId]
          )

          if (leave_Balance.length === 0) {
            return res.json({message: 'session leave balance not found!'});
          }

          const [result] = await pool.execute(
            `INSERT INTO sessionLeave (student_id, session_id, current_leave, predicted_leave)
            VALUES (?, ?, ?, ?)`,
            [id, sessionId, leave_Balance[0].leave_balance, leave_Balance[0].leave_balance]
          )

          if (result.affectedRows > 0) {
            console.log('Insert successful, new id =', result.session_leave_id);
            res.json({ currentLeave: leave_Balance[0].leave_balance, predictedLeave: leave_Balance[0].leave_balance, successfully:true})
          } else {
            return res.json({message: 'insert failed or no rows matched'});
          }

        } else { // else fetch leave balance from student sessionleave
          const [leaveAmounts] = await pool.execute(
            `SELECT current_leave, predicted_leave
            FROM sessionleave
            WHERE session_id = ? AND student_id = ?`,
            [sessionId, id]
          )

          if (leaveAmounts.length === 0) {
            return res.json({message: 'session leave record not found!'});
          }

          res.json({ currentLeave: leaveAmounts[0].current_leave, predictedLeave: leaveAmounts[0].predicted_leave, successfully:true})
        }
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchCurrentCourses = async (req, res) => {
  try {
    const { programId: programID } = req.user;

    const [rows] = await pool.execute(
      `SELECT c.course_id, c.course_code, c.course_name, l.lecturer_name, l.lecturer_id
      FROM Course c
      INNER JOIN CourseAssignment ca 
      ON c.course_id = ca.course_id 
      AND ca.assign_status = TRUE
      INNER JOIN Lecturer l 
      ON ca.lecturer_id = l.lecturer_id
      WHERE c.program_id = ? 
      AND c.course_status = TRUE
      ORDER BY c.course_code ASC`,
      [programID]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Currently no courses with assigned lecturers found.', success: false });
    }

    console.log(rows)
    return res.json({ courses: rows, success: true });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
