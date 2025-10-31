const pool = require('../config/database.cjs');

exports.fetchStudentUser = async (req, res) => {
  try {
    const { studentId } = req.body;
    const { programId } = req.user;

    const [studentInfo] = await pool.execute(
      `SELECT student_name, student_status, date_join, student_email, contact_no
        FROM Student
        WHERE student_id = ?`,
        [studentId]
    );

    if (studentInfo.length === 0) {
      return res.json({ message: 'No student found!' });
    }

    const [programName] = await pool.execute(
      `SELECT program_name
        FROM Program
        WHERE program_id = ?`,
        [programId]
    );

    if (programName.length === 0) {
      return res.json({ message: 'No program found!' });
    }

    res.json({ students: studentInfo, programName: programName , successfully:true});
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchLecturerUser = async (req, res) => {
  try {
    const { lecturerId } = req.body;
    const { programId } = req.user;

    const [lecturerInfo] = await pool.execute(
      `SELECT lecturer_name, lecturer_status, date_join, lecturer_email, contact_no
        FROM Lecturer
        WHERE lecturer_id = ?`,
        [lecturerId]
    );

    if (lecturerInfo.length === 0) {
      return res.json({ message: 'No student found!' });
    }

    const [programName] = await pool.execute(
      `SELECT program_name
        FROM Program
        WHERE program_id = ?`,
        [programId]
    );

    if (programName.length === 0) {
      return res.json({ message: 'No program found!' });
    }

    res.json({ lecturer: lecturerInfo, programName: programName , successfully:true});
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchOwnUser = async (req, res) => {
  try {
    const { programId, role, id } = req.user;

    // if user own is student
    if (role === 'student') {
        // fetch student info
        const [studentInfo] = await pool.execute(
            `SELECT student_name, student_status, date_join, student_email, contact_no
            FROM Student
            WHERE student_id = ?`,
            [id]
        );
        
        if (studentInfo.length === 0) {
            return res.json({ message: 'No student found!' });
        }
        
        // fetch program
        const [programName] = await pool.execute(
            `SELECT program_name
            FROM Program
            WHERE program_id = ?`,
            [programId]
        );
        
        if (programName.length === 0) {
            return res.json({ message: 'No program found!' });
        }
        
        res.json({ user: studentInfo, programName: programName , successfully:true});
    }

    // if user own is lecturer
    if (role === 'lecturer') {
        // fetch lecturer info
        const [lecturerInfo] = await pool.execute(
            `SELECT lecturer_name, lecturer_status, date_join, lecturer_email, contact_no
            FROM Lecturer
            WHERE lecturer_id = ?`,
            [id]
        );

        if (lecturerInfo.length === 0) {
          return res.json({ message: 'No lecturer found!' });
        }

        // fetch program
        const [programName] = await pool.execute(
            `SELECT program_name
            FROM Program
            WHERE program_id = ?`,
            [programId]
        );

        if (programName.length === 0) {
            return res.json({ message: 'No program found!' });
        }

        res.json({ user: lecturerInfo, programName: programName , successfully:true});
    }

    // if user own is hop
    if (role === 'hop') {
        // fetch hop info
        const [hopInfo] = await pool.execute(
            `SELECT hop_name, hop_status, date_join, hop_email, contact_no
            FROM HOP
            WHERE hop_id = ?`,
            [id]
        );

        if (hopInfo.length === 0) {
          return res.json({ message: 'No hop found!' });
        }

        // fetch program
        const [programName] = await pool.execute(
            `SELECT program_name
            FROM Program
            WHERE program_id = ?`,
            [programId]
        );

        if (programName.length === 0) {
            return res.json({ message: 'No program found!' });
        }

        res.json({ user: hopInfo, programName: programName , successfully:true});
    }

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.saveUserInfo = async (req, res) => {
  try {
    const { userId, userRole, userName, userEmail, userNum, userJoinDate, userStatus } = req.body;
    const { id } = req.user;

    let selectedId = null;

    console.log( userId, userRole, userName, userEmail, userNum, userJoinDate, userStatus, id )

    if (userId === 'own') {
      selectedId = id;
    } else {
      selectedId = userId;
    }

    if (userRole === 'student') {
      await pool.execute(
        `UPDATE Student
         SET student_name = ?, student_status = ?, date_join = ?, student_email = ?, contact_no = ?
         WHERE student_id = ?`,
        [userName, userStatus, userJoinDate, userEmail, userNum, selectedId]
      );
    }

    if (userRole === 'lecturer') {
      await pool.execute(
        `UPDATE Lecturer
         SET lecturer_name = ?, lecturer_status = ?, date_join = ?, lecturer_email = ?, contact_no = ?
         WHERE lecturer_id = ?`,
         [userName, userStatus, userJoinDate, userEmail, userNum, selectedId]
      );
    }

    if (userRole === 'hop') {
      await pool.execute(
        `UPDATE HOP
         SET hop_name = ?, hop_status = ?, date_join = ?, hop_email = ?, contact_no = ?
         WHERE hop_id = ?`,
        [userName, userStatus, userJoinDate, userEmail, userNum, selectedId]
      );
    }

    res.json({ message:'updated successfully!', successfully:true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}