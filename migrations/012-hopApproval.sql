CREATE TABLE IF NOT EXISTS HOPApproval (
  hop_approve_id      INT AUTO_INCREMENT PRIMARY KEY,
  leave_id            INT NOT NULL,
  hop_id              INT NOT NULL,
  approve_status      VARCHAR(20) DEFAULT 'pending',
  approve_date        DATE NOT NULL,
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hop_approve_leave
    FOREIGN KEY (leave_id)
    REFERENCES LeaveRequest (leave_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_approve_hop
    FOREIGN KEY (hop_id)
    REFERENCES HOP (hop_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  UNIQUE KEY unique_hop_leave (leave_id, hop_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;