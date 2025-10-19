const path = require('path');
const fs = require('fs');

exports.uploadFiles = async (req, res) => {
  try {
    const fileInfos = req.files.map(file => ({
      file_name: file.originalname,
      file_url: `/uploads/${file.filename}`,
    }));

    // 这里可以插入数据库，例如：
    // await pool.execute('INSERT INTO LeaveFiles (leave_id, file_name, file_url) VALUES (?, ?, ?)', [...]);

    res.json({
      success: true,
      message: 'Files uploaded successfully!',
      files: fileInfos,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};
