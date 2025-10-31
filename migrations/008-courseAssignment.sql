CREATE TABLE IF NOT EXISTS CourseAssignment (
  assign_id      INT AUTO_INCREMENT PRIMARY KEY,
  course_id      INT NULL,
  lecturer_id    INT NULL,
  session_id     INT NULL,
  assign_status  BOOLEAN DEFAULT TRUE,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_course_courseassignment
    FOREIGN KEY (course_id)
    REFERENCES Course (course_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_lecturer_courseassignment
    FOREIGN KEY (lecturer_id)
    REFERENCES Lecturer (lecturer_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT fk_session_courseassignment
    FOREIGN KEY (session_id)
    REFERENCES Session (session_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
