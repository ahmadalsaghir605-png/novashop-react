import { Router } from 'express';
import bcrypt from 'bcryptjs';

import { createUser, findUserByEmail, findPublicUserById } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { signToken } from '../utils/token.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const [existing] = await findUserByEmail(email);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await createUser(name, email, passwordHash, 'customer');

    const user = { id: result.insertId, name, email, role: 'customer' };
    const token = signToken(user.id);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await findUserByEmail(email);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const [rows] = await findPublicUserById(req.user.id);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});


// Google sign-in endpoint
router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential' });
    }

    // Verify Google token
    const googleApiUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const googleRes = await axios.get(googleApiUrl);
    const { email, name, sub: googleId } = googleRes.data;
    if (!email) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    // Check if user exists
    const [rows] = await findUserByEmail(email);
    let user;
    if (rows.length) {
      user = rows[0];
    } else {
      // Create user with no password, role 'customer'
      const [result] = await createUser(name || email, email, '', 'customer');
      user = { id: result.insertId, name: name || email, email, role: 'customer' };
    }

    // Sign JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

export default router;
