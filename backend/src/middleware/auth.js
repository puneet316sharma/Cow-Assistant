import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cow_assistant_super_secret_jwt_key_2026');
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found or invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed verification' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user?.role}' is not authorized to access this route` });
    }
    next();
  };
};
