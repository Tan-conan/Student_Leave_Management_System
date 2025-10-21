const pool = require('../config/database.cjs');

exports.sendRemark = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { remarkMessage, leave_id } = req.body

    const currentDate = new Date().toLocaleDateString('en-ca')

    console.log( id, role, remarkMessage, leave_id, currentDate )

    if (role === 'lecturer') {
      const [result] = await pool.execute( // if lecturer sending remark
        `INSERT LecturerRemark (leave_id, lecturer_id, remark_content, remark_date )
        VALUES (?, ?, ?, ?)`,
        [leave_id, id, remarkMessage, currentDate]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to save this remark of lecturer!'})
      }
    } else if (role === 'hop') {
      const [result] = await pool.execute( // if lecturer sending remark
        `INSERT HOPRemark (leave_id, hop_id, remark_content, remark_date )
        VALUES (?, ?, ?, ?)`,
        [leave_id, id, remarkMessage, currentDate]
      );

      if (result.length === 0) {
        return res.json({message: 'failed to save this remark of hop!'})
      }
    } else {
      return res.json({message: 'You dont have permission to send remark!'})
    }

    return res.json({ message:'send remark successfully!', successfully:true });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.fetchRemark = async (req, res) => {
  try {
    const { leave_id } = req.body

    console.log( leave_id )

    const [remarkRows] = await pool.execute(
      `SELECT 
      CONCAT('l-', l.lec_remark_id) AS remark_id,
      lec.lecturer_name AS name, 'lecturer' AS role, l.remark_content, l.remark_date
      FROM LecturerRemark l
      LEFT JOIN Lecturer lec ON l.lecturer_id = lec.lecturer_id
      WHERE l.leave_id = ?
    
      UNION ALL
    
      SELECT 
      CONCAT('h-', h.hop_remark_id) AS remark_id,
      hop.hop_name AS name, 'hop' AS role,  h.remark_content, h.remark_date
      FROM HOPRemark h
      LEFT JOIN HOP hop ON h.hop_id = hop.hop_id
      WHERE h.leave_id = ?
      
      ORDER BY remark_date ASC`,
        [leave_id, leave_id]
    );

    console.log(remarkRows)

    return res.json({remarkRows});
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}