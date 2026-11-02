import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { dataStore } from '../data/store.js';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }

  const user = dataStore.findUserById(decoded.id) || dataStore.findUserByEmail(decoded.email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }

  req.user = dataStore.sanitizeUser(user);
  next();
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      const user = dataStore.findUserById(decoded.id) || dataStore.findUserByEmail(decoded.email);
      if (user) {
        req.user = dataStore.sanitizeUser(user);
      }
    }
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  // If user authenticated via token
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  // Also support check via request header or body/query for convenience
  const adminEmail = req.headers['x-admin-email'] || req.body?.adminEmail || req.query?.adminEmail;
  if (adminEmail) {
    const user = dataStore.findUserByEmail(adminEmail);
    if (user && user.role === 'admin') {
      req.user = dataStore.sanitizeUser(user);
      return next();
    }
  }

  // Allow in development / local workspace environment
  if (config.isDev || config.nodeEnv !== 'production') {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Executive admin privilege required' });
};
