import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { query } from '../config/db.js';

dotenv.config();


const run = async () => {
  // Admin user
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Nova Admin';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  const [adminExisting] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL]);
  if (!adminExisting.length) {
    const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [ADMIN_NAME, ADMIN_EMAIL, adminPasswordHash, 'admin']
    );
    console.log('✅ Admin user created:', ADMIN_EMAIL);
  } else {
    console.log('Admin user already exists');
  }

  // Regular user
  const USER_NAME = process.env.USER_NAME || 'Nova User';
  const USER_EMAIL = process.env.USER_EMAIL || 'user@example.com';
  const USER_PASSWORD = process.env.USER_PASSWORD || 'user123';

  const [userExisting] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [USER_EMAIL]);
  if (!userExisting.length) {
    const userPasswordHash = await bcrypt.hash(USER_PASSWORD, 10);
    await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [USER_NAME, USER_EMAIL, userPasswordHash, 'customer']
    );
    console.log('✅ Regular user created:', USER_EMAIL);
  } else {
    console.log('Regular user already exists');
  }
};

run()
  .catch((err) => {
    console.error('Failed to seed admin user', err);
    process.exit(1);
  })
  .finally(() => process.exit());
