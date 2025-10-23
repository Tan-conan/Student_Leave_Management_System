CREATE TABLE IF NOT EXISTS otpLecturer (
  otp_lec_id      INT AUTO_INCREMENT PRIMARY KEY,
  lecturer_id     INT NULL,
  otp_code        VARCHAR(10) NOT NULL,
  otp_status      BOOLEAN DEFAULT TRUE,
  expires_at      DATETIME NOT NULL,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lecturer_otp
    FOREIGN KEY (lecturer_id)
    REFERENCES Lecturer (lecturer_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

