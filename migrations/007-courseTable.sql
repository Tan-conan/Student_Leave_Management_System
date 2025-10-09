CREATE TABLE IF NOT EXISTS Course (
  course_id       INT AUTO_INCREMENT PRIMARY KEY,
  program_id      VARCHAR(20) NULL,
  course_code     VARCHAR(255) NOT NULL,
  course_name     VARCHAR(255) NOT NULL,
  course_status   tinyint(1) DEFAULT '1',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_program_course
    FOREIGN KEY (program_id)
    REFERENCES Program (program_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;