CREATE TABLE IF NOT EXISTS HOPRemark (
  hop_remark_id      INT AUTO_INCREMENT PRIMARY KEY,
  leave_id            INT NULL,
  hop_id              INT NULL,
  remark_content      TEXT NOT NULL,
  remark_date         DATE NULL,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_remark_leave_hop
    FOREIGN KEY (leave_id)
    REFERENCES LeaveRequest (leave_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_remark_hop
    FOREIGN KEY (hop_id)
    REFERENCES HOP (hop_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;