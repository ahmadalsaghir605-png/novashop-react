import jwt from 'jsonwebtoken';

import { findPublicUserById } from '../models/userModel.js';

const unauthorized = (res, message = 'Not authorized') =>
  res.status(401).json({ message });

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return unauthorized(res);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await findPublicUserById(decoded.id);

    if (!rows.length) {
      return unauthorized(res);
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Auth error', error.message);
    return unauthorized(res, 'Invalid token');
  }
};

export const optionalAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await findPublicUserById(decoded.id);

    if (rows.length) {
      req.user = rows[0];
    }
  } catch (error) {
    console.warn('Optional auth failed', error.message);
  }

  next();
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return unauthorized(res);
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
