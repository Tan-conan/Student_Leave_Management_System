const pool = require('../config/database.cjs');

/*
type of the leave file status

pending: no lecturer or hop approve or reject it
progressing: no hop approve or reject, some lecturer approves or still pending
lecturer rejected: no hop approve or reject, but got at least 1 lecturer rejected
lecturer approved: no hop approve or reject, but all lecturer approved
final approved: hop aproved, ignore the approve/reject of all lecturers, cannot be further approve or reject anymore
final rejected: hop rejected, ignore the approve/reject of all lecturers, cannot be further approve or reject anymore

only final approve will decrease the current leave balance of student

*/

exports.approveRequest = async (req, res) => {
  try {
    const { leave_id } = req.body;
    const { id, role, sessionId } = req.user;

    const currentDate = new Date().toLocaleDateString('en-ca')

    // unable to approve leave when no session
    if (sessionId === 'none') {
      return res.json({message: 'No session available!Unable to approve the leave!'})
    }

    // fetch leave_status from the database for safety
    const [requestStatus] = await pool.execute(
      `SELECT leave_status
        FROM LeaveRequest
        WHERE leave_id = ?`,
        [leave_id]
    )

    if (requestStatus === 0) { // cannot find status, return
      return res.json({message: 'failed to approve this request!request Status unfound!'})
    } else if (requestStatus[0].leave_status === 'final approved' || requestStatus[0].leave_status === 'final rejected') {
      // final approved/rejected, return
      return res.json({message: 'Cannot approve/reject this leave since it is already approved/rejected by hop!'})
    }
    
    if (role === 'lecturer') { // if approver is lecturer
      // check did the lecturer approved/rejected to this leave before
      const [checking] = await pool.execute(
        `SELECT lec_approve_id
        FROM LecturerApproval
        WHERE leave_id = ? AND lecturer_id = ? AND approve_status != 'pending'`,
        [leave_id, id]
      )

      // if got found , return
      if (checking.length > 0) {
        return res.json({message: 'You are unable to reapprove/reject a same leave again!'})
      }

      const [result] = await pool.execute(
        `UPDATE LecturerApproval
        SET approve_status = 'approved' , approve_date = ?
        WHERE lecturer_id = ? AND leave_id = ?`,
        [currentDate, id, leave_id]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to approve this request when approving as lecturer!'})
      }

      if (requestStatus[0].leave_status === 'pending') { // if this request in pending status, make it progressing after approve
        const [result] = await pool.execute(
          `UPDATE LeaveRequest
          SET leave_status = 'progressing'
          WHERE leave_id = ?`,
          [leave_id]
        );

        if (result.length === 0) {
          return res.json({message: 'failed to change status from pending to progressing!'})
        }
      }

      // fetch every related lecturerapproval state
      const [approveState] = await pool.execute(
        `SELECT approve_status
        FROM LecturerApproval
        WHERE leave_id = ?`,
        [leave_id]
      )

      if (approveState.length === 0) {
        return res.json({message: 'failed to fetch any status from the leave!'})
      } else { // check did all lecturer in this leave approved or not

        let allApproved = true
        
        // if got one lecturer rejected before, stop checking
        for (const row of approveState) {
          if (row.approve_status !== 'approved') {
            console.log('Found not approved status')
            allApproved = false;
            break;
          }
        }

        // if all approved change the leave status into lecturer approved
        if (allApproved) {
          console.log("all lecturer approved")
          const [result] = await pool.execute(
            `UPDATE LeaveRequest 
            SET leave_status = 'lecturer approved' 
            WHERE leave_id = ?`,
            [leave_id]
          )

          if (result.length === 0) {
            return res.json({message: 'failed to approve this request when approving as hop!'})
          }
        }

      }

    } else if (role === 'hop') {
      // check did the hop approved/rejected to this leave before
      const [checking] = await pool.execute(
        `SELECT hop_approve_id
        FROM HOPApproval
        WHERE leave_id = ? AND hop_id = ? AND approve_status != 'pending'`,
        [leave_id, id]
      )

      // if got found , return
      if (checking.length > 0) {
        return res.json({message: 'You are unable to reapprove/reject a same leave again!'})
      }

      const [result] = await pool.execute( // if approver is hop
        `INSERT HopApproval (leave_id, hop_id, approve_status, approve_date )
        VALUES (?, ?, 'approved', ?)`,
        [leave_id, id, currentDate]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to approve this request when approving as hop!'})
      }

      // because hop approved the leave, make the leave status final approved
      const [finalApprove] = await pool.execute(
        `UPDATE LeaveRequest 
        SET leave_status = 'final approved' 
        WHERE leave_id = ?`,
        [leave_id]
      )

      if (finalApprove.length === 0) {
        return res.json({message: 'failed to final approve this request when approving as hop!'})
      }

      // fetch leave days of this leave
      const [leaveInfo] = await pool.execute(
      `SELECT leave_days, student_id
        FROM LeaveRequest
        WHERE leave_id = ?`,
        [leave_id]
      );

      if (leaveInfo.length === 0) {
        return res.json({message: 'failed to fetch the leave days!'})
      }

      // decrease student current leave after final approve
      const [minusLeaveBalance] = await pool.execute(
        `UPDATE SessionLeave 
        SET current_leave = current_leave - ? 
        WHERE student_id = ? AND session_id = ?`,
        [leaveInfo[0].leave_days, leaveInfo[0].student_id, sessionId]
      )

      if (minusLeaveBalance.length === 0) {
        return res.json({message: 'failed to decrease leave balance!'})
      }

    } else { // not lecturer, not hop, no permission to approve the request
      return res.json({message: 'You do not have permission to do this!'})
    }

    return res.json({message:'approved the leave successfully!', successfully:true})

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.rejectRequest = async (req, res) => {
  try {
    const { leave_id } = req.body;
    const { id, role, sessionId } = req.user;

    const currentDate = new Date().toLocaleDateString('en-ca')

    // unable to reject leave when no session
    if (sessionId === 'none') {
      return res.json({message: 'No session available!Unable to reject the leave!'})
    }

    // fetch leave_status from the database for safety
    const [requestStatus] = await pool.execute(
      `SELECT leave_status
        FROM LeaveRequest
        WHERE leave_id = ?`,
        [leave_id]
    )

    if (requestStatus === 0) { // cannot find status, return
      return res.json({message: 'failed to approve this request!request Status unfound!'})
    } else if (requestStatus[0].leave_status === 'final approved' || requestStatus[0].leave_status === 'final rejected') {
      // final approved/rejected, return
      return res.json({message: 'Cannot approve/reject this leave since it is already approved/rejected by hop!'})
    }
    
    if (role === 'lecturer') { // if approver is lecturer
      // check did the lecturer approved/rejected to this leave before
      const [checking] = await pool.execute(
        `SELECT lec_approve_id
        FROM LecturerApproval
        WHERE leave_id = ? AND lecturer_id = ? AND approve_status != 'pending'`,
        [leave_id, id]
      )

      // if got found , return
      if (checking.length > 0) {
        return res.json({message: 'You are unable to reapprove/reject a same leave again!'})
      }

      const [result] = await pool.execute(
        `UPDATE LecturerApproval
        SET approve_status = 'rejected' , approve_date = ?
        WHERE lecturer_id = ? AND leave_id = ?`,
        [currentDate, id, leave_id]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to reject this request when approving as lecturer!'})
      }

      if (requestStatus[0].leave_status === 'pending') { // this request in pending status, make it rejected after reject
        const [result] = await pool.execute(
          `UPDATE LeaveRequest
          SET leave_status = 'lecturer rejected'
          WHERE leave_id = ?`,
          [leave_id]
        );

        if (result.length === 0) {
          return res.json({message: 'failed to change status from pending to lecturer rejected!'})
        }
      }

    } else if (role === 'hop') {
      // check did the hop approved/rejected to this leave before
      const [checking] = await pool.execute(
        `SELECT hop_approve_id
        FROM HOPApproval
        WHERE leave_id = ? AND hop_id = ? AND approve_status != 'pending'`,
        [leave_id, id]
      )

      // if got found , return
      if (checking.length > 0) {
        return res.json({message: 'You are unable to reapprove/reject a same leave again!'})
      }

      const [result] = await pool.execute( // if approver is hop
        `INSERT HopApproval (leave_id, hop_id, approve_status, approve_date )
        VALUES (?, ?, 'rejected', ?)`,
        [leave_id, id, currentDate]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to reject this request when approving as hop!'})
      }

      // because hop rejected the leave, make the leave status final rejected
      const [finalApprove] = await pool.execute(
        `UPDATE LeaveRequest 
        SET leave_status = 'final rejected' 
        WHERE leave_id = ?`,
        [leave_id]
      )

      if (finalApprove.length === 0) {
        return res.json({message: 'failed to final approve this request when approving as hop!'})
      }

      // fetch leave days of this leave
      const [leaveInfo] = await pool.execute(
      `SELECT leave_days, student_id
        FROM LeaveRequest
        WHERE leave_id = ?`,
        [leave_id]
      );

      if (leaveInfo.length === 0) {
        return res.json({message: 'failed to fetch the leave days!'})
      }

      // add back student predicted leave after final reject because the leave is rejected
      const [minusLeaveBalance] = await pool.execute(
        `UPDATE SessionLeave 
        SET predicted_leave = predicted_leave + ? 
        WHERE student_id = ? AND session_id = ?`,
        [leaveInfo[0].leave_days, leaveInfo[0].student_id, sessionId]
      )

      if (minusLeaveBalance.length === 0) {
        return res.json({message: 'failed to decrease leave balance!'})
      }

    } else { // not lecturer, not hop, no permission to approve the request
      return res.json({message: 'You do not have permission to do this!'})
    }

    return res.json({message:'approved the leave successfully!', successfully:true})

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchLeaveRequestInfo = async (req, res) => {
  try {
    const { leave_id } = req.body;
    let student_name = null;

    const [rows] = await pool.execute(
      `SELECT leave_date, end_date, leave_name, leave_type, leave_status, submission_date, leave_reason, leave_days
        FROM LeaveRequest
        WHERE leave_id = ?`,
        [leave_id]
    );

    if (rows.length === 0) {
      return res.json({message: 'fetch leave info failed, no leave found!'});
    }

    const [studentName] = await pool.execute(
      `SELECT s.student_name
        FROM Student s
        JOIN LeaveRequest lr ON s.student_id = lr.student_id
        WHERE leave_id = ?`,
        [leave_id]
    );

    if (rows.length === 0) {
      return res.json({message: 'fetch student name failed!'});
    }

    student_name = studentName[0].student_name

    return res.json({ leaveInfo: rows, student_name, successfully:true });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchApprovementLecturers = async (req, res) => {
  try {
    const { leave_id } = req.body;

    const [rows] = await pool.execute(
      `SELECT l.lecturer_name, l.lecturer_status, la.approve_status, la.approve_date, la.approve_remark
      FROM LecturerApproval la
      INNER JOIN Lecturer l ON la.lecturer_id = l.lecturer_id
      WHERE la.leave_id = ?`,
        [leave_id]
    );

    // no matter got result or not return it
    return res.json({ approveInfo: rows});

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchViewerDicision = async (req, res) => {
  try {
    const { leave_id } = req.body;
    const { id, role } = req.user

    // FALSE means lecturer/hop did not approve/reject the leave, TRUE means lecturer/hop already approve/reject the leave
    let dicision = null;

    if (role === 'lecturer' ) {
      // fetch current lecturer has make dicision for this leave or not
      const [lecturerApprovement] = await pool.execute(
      `SELECT approve_status
      FROM LecturerApproval
      WHERE leave_id = ? AND lecturer_id = ?`,
        [leave_id, id]
    );

    // cant find any data, return
    if (lecturerApprovement.length === 0) {
      console.log('cant find apprvement data!')
      return;
    }

    // if status is pending, means this lecturer isnt approve/reject the leave yet
    if (lecturerApprovement[0].approve_status === 'pending') {
      dicision = false
    } else {
      dicision = true
    }

    return res.json({dicision})

    } else if (role === 'hop') {
      // unlike lecturer, hopapprovement row only insert when hop approve/reject the leave
      const [HOPApprovement] = await pool.execute(
      `SELECT approve_status
      FROM HOPApproval
      WHERE leave_id = ? AND hop_id = ?`,
        [leave_id, id]
    );

    // cant find any means hop did not approve/reject the leave yet
    if (HOPApprovement.length === 0) {
      dicision = false
    } else {
      dicision = true
    }

    return res.json({dicision})

    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.checkStudentLeaveBalanceLA = async (req, res) => {
  try {
    const { sessionId } = req.user;
    const { leave_id } = req.body;
    console.log( sessionId, leave_id )

    let leaveBalance = null;
    let predictedLeave = null;
    let validLeaveDay = null;

    // no session leave balance all none
    if (sessionId === 'none') {
        leaveBalance = 'Unavailable'
        predictedLeave = 'Unavailable when no session'
        validLeaveDay = 'Unavailable when no session'
        return res.json({ currentLeave: leaveBalance, predictedLeave, validLeaveDay, successfully:true});
    } else { // fetch student leave balance based on session id and leave_id
      const [leaveAmounts] = await pool.execute(
        `SELECT sl.current_leave, sl.predicted_leave
        FROM SessionLeave sl
        JOIN LeaveRequest lr 
        ON sl.student_id = lr.student_id 
        AND sl.session_id = lr.session_id
        WHERE lr.leave_id = ?`,
        [leave_id]
      );
      
      if (leaveAmounts.length === 0) {
        return res.json({message: 'session leave record not found!'});
      }

      return res.json({ currentLeave: leaveAmounts[0].current_leave, predictedLeave: leaveAmounts[0].predicted_leave, successfully:true});
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}