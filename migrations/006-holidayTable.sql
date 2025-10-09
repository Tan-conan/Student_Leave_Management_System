CREATE TABLE IF NOT EXISTS Holiday (
  holiday_id       INT AUTO_INCREMENT PRIMARY KEY,
  session_id       INT NULL,
  holiday_name     VARCHAR(255) NOT NULL,
  starting_date    DATE NOT NULL,
  ending_date      DATE NOT NULL,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_session_holiday
    FOREIGN KEY (session_id)
    REFERENCES Session (session_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;