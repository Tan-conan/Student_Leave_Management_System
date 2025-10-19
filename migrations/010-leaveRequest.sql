CREATE TABLE IF NOT EXISTS LeaveRequest (
  leave_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id      VARCHAR(20) NOT NULL,
  session_id      INT NOT NULL,
  leave_name      VARCHAR(20) NOT NULL,
  leave_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  leave_days      INT NOT NULL,          
  leave_type      VARCHAR(20) NOT NULL,        
  leave_reason    TEXT NOT NULL,
  leave_status    VARCHAR(20) NOT NULL,
  submission_date DATE NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_leaveRequest_student FOREIGN KEY (student_id)
    REFERENCES Student(student_id)
    ON DELETE CASCADE,
    
  CONSTRAINT fk_leaveRequsest_session FOREIGN KEY (session_id)
    REFERENCES Session(session_id)
    ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;