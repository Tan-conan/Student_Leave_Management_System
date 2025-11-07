CREATE TABLE IF NOT EXISTS Lecturer (
  lecturer_id     INT AUTO_INCREMENT PRIMARY KEY,
  program_id      VARCHAR(20) NOT NULL,
  lecturer_name   VARCHAR(255) NOT NULL,
  lecturer_email  VARCHAR(255) NOT NULL UNIQUE,
  contact_no      VARCHAR(20) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  date_join       DATE NOT NULL,
  lecturer_status VARCHAR(20) DEFAULT 'pending',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lecturer_program
    FOREIGN KEY (program_id)
    REFERENCES Program (program_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

