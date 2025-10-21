CREATE TABLE IF NOT EXISTS otpStudent (
  otp_stu_id      INT AUTO_INCREMENT PRIMARY KEY,
  student_id      VARCHAR(20) NULL,
  otp_code        VARCHAR(10) NOT NULL,
  otp_status      BOOLEAN DEFAULT TRUE,
  expires_at      DATETIME NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_student_otp
    FOREIGN KEY (student_id)
    REFERENCES Student (student_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  UNIQUE KEY unique_active_otp (student_id, otp_status)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

