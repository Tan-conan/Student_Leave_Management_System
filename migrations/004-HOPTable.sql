CREATE TABLE IF NOT EXISTS HOP (
  hop_id       INT AUTO_INCREMENT PRIMARY KEY,
  program_id   VARCHAR(20) NOT NULL,
  hop_name     VARCHAR(255) NOT NULL,
  hop_email    VARCHAR(255) NOT NULL UNIQUE,
  contact_no   VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  hop_status   VARCHAR(20) DEFAULT 'active',
  date_join    DATE NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hop_program
    FOREIGN KEY (program_id)
    REFERENCES Program (program_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;