CREATE TABLE IF NOT EXISTS Student (
  student_id     VARCHAR(20) PRIMARY KEY,
  program_id     VARCHAR(20) NULL,
  student_name   VARCHAR(255) NOT NULL,
  student_email  VARCHAR(255) NOT NULL UNIQUE,
  contact_no     VARCHAR(20) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  leave_balance  INT DEFAULT 0,
  date_join      DATE NULL,
  student_state  VARCHAR(20) DEFAULT 'active',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_student_program
    FOREIGN KEY (program_id)
    REFERENCES Program (program_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
