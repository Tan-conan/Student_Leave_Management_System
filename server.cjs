require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth.cjs');
const sessionManage = require('./routes/sessionManage.cjs');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessionManage', sessionManage);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
