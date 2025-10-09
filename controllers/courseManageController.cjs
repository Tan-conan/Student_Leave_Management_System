const pool = require('../config/database.cjs');

exports.fetchCurrentCourses = async (req, res) => {
  try {
    const { programID } = req.body;

    const [rows] = await pool.execute(
      `SELECT 
        c.course_id, c.course_code, c.course_name,
        IFNULL(l.lecturer_name, 'None') AS lecturer_name
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
    const { programID } = req.body;

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
    const { programID, courseName, courseCode } = req.body;

    console.log(programID, courseName, courseCode)

    //find same name course
    const [name] = await pool.execute(
      `SELECT course_name
        FROM Course
        WHERE program_id = ? AND course_name = ?`,
        [programID, courseName]
    );

    if (name.length !== 0) {
      return res.json({ message: `Course with the name ${courseName} has been created before!`, successfully: false });
    }

    //find same code course
    const [code] = await pool.execute(
      `SELECT course_code
        FROM Course
        WHERE program_id = ? AND course_code = ?`,
        [programID, courseCode]
    );

    if (code.length !== 0) {
      return res.json({ message: `Course with the code ${courseCode} has been created before!`, successfully: false});
    }

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
    const { courseName, lecturer_id, session_id } = req.body;

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
       WHERE course_id = ? AND session_id = ? AND assign_status = TRUE`,
      [courseId[0].course_id, session_id]
    );

    // if got assigned course unassign it
    if (activeAssign.length != 0) {
      await pool.execute(
        `UPDATE CourseAssignment
         SET assign_status = FALSE
         WHERE assign_id = ?`,
        [activeAssign[0].assign_id]
      );
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

    console.log( courseName );

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