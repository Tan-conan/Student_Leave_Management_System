require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.cjs');
const sessionManage = require('./routes/sessionManage.cjs');
const courseManage = require('./routes/courseManage.cjs')
const mainFunction = require('./routes/mainFunction.cjs')
const lecturerManage = require('./routes/lecturerManage.cjs')
const studentManage = require('./routes/studentManage.cjs')
const userManage = require('./routes/userManage.cjs')
const leaveApplyManage = require('./routes/leaveApplyManage.cjs')
const LRListManage = require('./routes/LRListManage.cjs')
const leaveApproveManage = require('./routes/leaveApproveManage.cjs')
// const uploadRoutes = require('./routes/upload.cjs');

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/sessionManage', sessionManage);
app.use('/api/courseManage', courseManage);
app.use('/api/mainFunction', mainFunction);
app.use('/api/lecturerManage', lecturerManage);
app.use('/api/studentManage', studentManage);
app.use('/api/userManage', userManage);
app.use('/api/leaveApplyManage', leaveApplyManage);
app.use('/api/LRListManage', LRListManage);
app.use('/api/leaveApproveManage', leaveApproveManage);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
