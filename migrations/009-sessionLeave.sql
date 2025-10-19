CREATE TABLE IF NOT EXISTS SessionLeave (
  session_leave_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  session_id INT NOT NULL,
  current_leave INT NOT NULL,          -- actual leave left
  predicted_leave INT NOT NULL,        -- predicted leave left
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_sessionleave_student FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_sessionleave_session FOREIGN KEY (session_id)
    REFERENCES Session(session_id)
    ON DELETE CASCADE,

  UNIQUE KEY unique_student_session (student_id, session_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
