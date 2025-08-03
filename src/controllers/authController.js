const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) {
      return sendErrorResponse(res, 400, 'User already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    
    sendSuccessResponse(res, 201, {
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        role: user.role 
      }, 
      token 
    }, 'User registered successfully');
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user);
    
    sendSuccessResponse(res, 200, {
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        role: user.role 
      }, 
      token 
    }, 'Login successful');
  } catch (err) {
    next(err);
  }
};