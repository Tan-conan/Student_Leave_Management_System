const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || '';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  // check header availability
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  
  // take out token by splitting
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Missing token' })

  try {
    // check token, including token correct or not, token outdated or not, only qualified and fetch information inside it
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}