CREATE TABLE IF NOT EXISTS LecturerApproval (
  lec_approve_id      INT AUTO_INCREMENT PRIMARY KEY,
  leave_id            INT NOT NULL,
  lecturer_id         INT NOT NULL,
  approve_status      VARCHAR(20) DEFAULT 'pending',
  approve_date        DATE NOT NULL,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_approve_leave
    FOREIGN KEY (leave_id)
    REFERENCES LeaveRequest (leave_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_approve_lecturer
    FOREIGN KEY (lecturer_id)
    REFERENCES Lecturer (lecturer_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  UNIQUE KEY unique_lecturer_leave (leave_id, lecturer_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;