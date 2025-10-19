CREATE TABLE IF NOT EXISTS Session (
  session_id       INT AUTO_INCREMENT PRIMARY KEY,
  program_id       VARCHAR(20) NULL,
  session_name     VARCHAR(255) NOT NULL,
  starting_date    DATE NoT NULL,
  ending_date      DATE NOT NULL,
  session_status   VARCHAR(20) DEFAULT 'unactivated',
  leave_balance    INT NOT NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_session_program
    FOREIGN KEY (program_id)
    REFERENCES Program (program_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;