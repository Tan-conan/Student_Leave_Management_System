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

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessionManage', sessionManage);
app.use('/api/courseManage', courseManage);
app.use('/api/mainFunction', mainFunction);
app.use('/api/lecturerManage', lecturerManage);
app.use('/api/studentManage', studentManage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
