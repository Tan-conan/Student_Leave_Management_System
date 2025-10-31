const pool = require('../config/database.cjs');

exports.fetchCurrentCourses = async (req, res) => {
  try {
    const { programId:programID } = req.user;

    const [rows] = await pool.execute(
      `SELECT 
        c.course_id, c.course_code, c.course_name,
        IFNULL(l.lecturer_name, 'None') AS lecturer_name,
        IFNULL(l.lecturer_id, 'None') AS lecturer_id
      FROM Course c
      LEFT JOIN CourseAssignment ca ON c.course_id = ca.course_id AND ca.assign_status = TRUE
      LEFT JOIN Lecturer l ON ca.lecturer_id = l.lecturer_id
      WHERE c.program_id = ? AND c.course_status = TRUE
      ORDER BY c.course_code ASC`,
      [programID]
    );

    if (rows.length === 0) {
      return res.json({ message: 'Currently no courses found for this program.' });
    }

    const [coursesName] = await pool.execute(
      `SELECT course_name
       FROM Course
       WHERE program_id = ? AND course_status = TRUE
       ORDER BY course_code ASC`,
       [programID]
    );

    res.json({ courses: rows, coursesName: coursesName, succesfully:true});
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.fetchLecturers = async (req, res) => {
  try {
    const { programId:programID } = req.user;

    const [rows] = await pool.execute(
      `SELECT lecturer_id, lecturer_name
        FROM Lecturer
        WHERE program_id = ? AND lecturer_status = 'active'
        ORDER BY lecturer_id ASC`,
        [programID]
    );

    if(rows.length === 0) return res.json({lecturers:[]});

    res.json({ lecturers: rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error'});
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseCode } = req.body;
    const { programId:programID } = req.user;

    console.log(programID, courseName, courseCode)

    //find same name course
    const [name] = await pool.execute(
      `SELECT course_name
        FROM Course
        WHERE program_id = ? AND course_name = ? AND course_status = 1`,
        [programID, courseName]
    );

    if (name.length !== 0) {
      return res.json({ message: `Course with the name ${courseName} has been created before!`, successfully: false });
    }

    //find same code course, course id only unique even different program
    const [code] = await pool.execute(
      `SELECT course_code
        FROM Course
        WHERE course_code = ? AND course_status = 1`,
        [courseCode]
    );

    if (code.length !== 0) {
      return res.json({ message: `Course with the code ${courseCode} has been created before!`, successfully: false});
    }

    // create course
    await pool.execute(
      `INSERT into Course (program_id, course_code, course_name)
       VALUES (?, ?, ?)`,
       [programID,courseCode,courseName]
    );

    res.json({ message: 'course create complete!', successfully: true});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.assignLecturer = async (req, res) => {
  try {
    const { courseName, lecturer_id } = req.body;
    const { sessionId:session_id, role, sessionStatus } = req.user;

    if (role !== 'hop') {
      return res.json({message:'you do not have permission to do this!'})
    }

    if (sessionStatus !== 'unactivated') {
      return res.json({message:'Unable to assign lecturers when there is no coming soon session!'})
    }

    console.log(courseName, lecturer_id, session_id);

    // find courseID
    const [courseId] = await pool.execute(
      `SELECT course_id
        FROM Course
        WHERE  course_name = ?`,
        [courseName]
    );

    // check course availability
    if (courseId.length === 0) {
      return res.json({ message: `Course unfound!`, successfully: false});
    }

    // detect current course got assigned a lecturer or not
    const [activeAssign] = await pool.execute(
      `SELECT assign_id FROM CourseAssignment 
       WHERE course_id = ? AND assign_status = TRUE`,
      [courseId[0].course_id]
    );

    // if got assigned course unassign all records of it
    console.log(activeAssign.length, activeAssign)
    if (activeAssign.length > 0) {
      const assignIds = activeAssign.map(a => a.assign_id);

      for (const id of assignIds) {
        await pool.execute(
          `UPDATE CourseAssignment
           SET assign_status = FALSE
           WHERE assign_id = ?`,
          [id]
        );
      }
    }

    // assign lecturer
    await pool.execute(
      `INSERT into CourseAssignment (course_id, lecturer_id, session_id, assign_status)
       VALUES (?, ?, ?, TRUE)`,
       [courseId[0].course_id, lecturer_id, session_id]
    )

    res.json({ message: 'course assign complete!', successfully:true});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseName } = req.body;
    const { role, sessionStatus } = req.user

    console.log( courseName, sessionStatus );

    if (role !== 'hop') {
      return res.json({message:'you do not have permission to do this!'})
    }

    if (sessionStatus === 'activated') {
      return res.json({message:'Unable to delete course during session!'})
    }

    await pool.execute(
        `UPDATE Course
         SET course_status = FALSE
         WHERE course_name = ?`,
        [courseName]
      );

    res.json({ message: `course "${courseName}" deleted successfully!` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveCourse = async (req, res) => {
  try {
    const { courseName, newCourseName, newCourseCode, lecturerId } = req.body;
    const { sessionId, sessionStatus } = req.user;

    console.log( courseName, newCourseName, newCourseCode, lecturerId, sessionId );

    // find course id
    const [courseId] = await pool.execute(
        `SELECT course_id
        FROM Course
        WHERE course_name = ?`,
        [courseName]
    )

    if (courseId.length === 0) {
      return res.json({message: 'course unfound in database!'})
    }

    // if going to have a session
    if (sessionStatus === 'unactivated') {
      // find assign state true for this course in this session, set all to false
      await pool.execute(
        `UPDATE CourseAssignment
         SET assign_status = FALSE
         WHERE course_id = ? AND session_id = ? AND assign_status = TRUE`,
        [courseId[0].course_id , sessionId]
      );
    }

    // change the course name and code with new one
    await pool.execute(
      `UPDATE Course
      SET course_name = ? , course_code = ?
      WHERE course_id = ?`,
      [newCourseName, newCourseCode, courseId[0].course_id]
    );

    // if lecturerId not none means wants to assign for new lecturer, else directly return
    if (lecturerId !== 'none' && sessionStatus === 'unactivated') {
      // assign lecturer
      await pool.execute(
        `INSERT into CourseAssignment (course_id, lecturer_id, session_id, assign_status)
        VALUES (?, ?, ?, TRUE)`,
        [courseId[0].course_id , lecturerId, sessionId]
      )
    }

    return res.json({message: 'edit course successfully!', successfully: true})

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};