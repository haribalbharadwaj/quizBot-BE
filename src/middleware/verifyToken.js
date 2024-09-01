const jwt = require('jsonwebtoken');
const User = require('../model/user');
const secret = process.env.Private_key || 'QuizBot_app'; // Use environment variable or fallback to default

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token format

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token,secret);
    const user = await User.findById(decoded.userID);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;  // Attach the user object to the request
    next();  // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
  
};

module.exports = verifyToken;
