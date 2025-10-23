const pool = require('../config/database.cjs');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadLeaveFiles = [upload.array('files'), async (req, res) => {
    try {
      const { leave_id } = req.body;
      const files = req.files;

      if (!leave_id || !files.length) {
        return res.status(400).json({ message: 'Missing leave_id or no files uploaded.' });
      }

      for (const file of files) {
        await pool.execute(
          `INSERT INTO LeaveFile (leave_id, file_name, file_data) VALUES (?, ?, ?)`,
          [leave_id, file.originalname, file.buffer]
        );
      }

      return res.json({ message: 'Files uploaded successfully!' });

    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Server error during file upload.' });
    }
  }
];

exports.getLeaveFiles = async (req, res) => {
  try {
    const { leave_id } = req.params;
    const [rows] = await pool.execute(
      `SELECT file_id, file_name,
              CONCAT('/api/leaveFileManage/downloadLeaveFile/', file_id) AS file_url
       FROM LeaveFile WHERE leave_id = ?`,
      [leave_id]
    );

    res.json({ files: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching files.' });
  }
};


exports.downloadLeaveFile = async (req, res) => {
  try {
    console.log('*** downloadLeaveFile called, params:', req.params);
    const { file_id } = req.params;
    const [rows] = await pool.execute(
      `SELECT file_name, file_data FROM LeaveFile WHERE file_id = ?`,
      [file_id]
    );
    console.log('DB returned rows:', rows.length);
    if (rows.length === 0) {
      console.log('file not found for id', file_id);
      return res.status(404).json({ message: 'File not found' });
    }
    const file = rows[0];
    console.log('file_name, file_data length:', file.file_name, file.file_data?.length, Buffer.isBuffer(file.file_data));
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.file_name}"`);
    res.send(file.file_data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error downloading file.' });
  }
};

