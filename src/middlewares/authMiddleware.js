const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendErrorResponse } = require('../utils/responseHelper');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return sendErrorResponse(res, 401, 'Access denied. No token provided');
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendErrorResponse(res, 401, 'User not found');
    }
    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return sendErrorResponse(res, 401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
      return sendErrorResponse(res, 401, 'Token expired');
    }
    next(err);
  }
};