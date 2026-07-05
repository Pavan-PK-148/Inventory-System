import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Append found user context structure directly to request lifecycle object
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Session verification signature failed; access rejected.'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('No authorization credentials provided.'));
  }
};

// Feature 1: RBAC Middleware Role Evaluation interceptor
export const authorizeRoles = (...permittedRoles) => {
  return (req, res, next) => {
    if (!req.user || !permittedRoles.includes(req.user.role)) {
      res.status(403); // Status code: Forbidden
      return next(new Error(`Security Restriction: Role [${req.user?.role || 'Guest'}] is unauthorized for this transaction.`));
    }
    next();
  };
};