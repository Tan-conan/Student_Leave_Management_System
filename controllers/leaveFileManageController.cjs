const pool = require('../config/database.cjs');
const multer = require('multer'); // for handling file uploads

const storage = multer.memoryStorage(); // store files in memory as Buffer objects
const upload = multer({ storage }); // store files in memory for easy access

// Upload files for a specific leave request
exports.uploadLeaveFiles = [upload.array('files'), async (req, res) => {
    try {
      const { leave_id } = req.body;
      const files = req.files; // get uploaded files from multer

      // if missing leave_id or no files uploaded
      if (!leave_id || !files.length) {
        console.log('Missing leave_id or no files uploaded.')
        return
      }

      // Insert each file into the leavefile table
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

// Get list of files for a specific leave request
exports.getLeaveFiles = async (req, res) => {
  try {
    const { leave_id } = req.params; // get leave_id from URL params

    // Fetch file metadata from the database, dont directly select file_data too big to fetch
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

// Download a specific file
exports.downloadLeaveFile = async (req, res) => {
  try {
    console.log('*** downloadLeaveFile called, params:', req.params);
    const { file_id } = req.params;

    // fetch file
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

    // print out file detail
    console.log('file_name, file_data length:', file.file_name, file.file_data?.length, Buffer.isBuffer(file.file_data));

    // set header, no header function dont know the file send is what

    // tell system this is unkown type binary data
    res.setHeader('Content-Type', 'application/octet-stream');
    // downlad the file directly
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    res.send(file.file_data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error downloading file.' });
  }
};

