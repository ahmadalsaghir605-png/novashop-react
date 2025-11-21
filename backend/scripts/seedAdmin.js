import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { query } from '../config/db.js';

dotenv.config();

const run = async () => {
  const ADMIN_NAME = process.env.ADMIN_NAME || 'Nova Admin';
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  const [existing] = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL]);
  if (existing.length) {
    console.log('Admin user already exists');
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, 'admin']
  );
  console.log('✅ Admin user created:', ADMIN_EMAIL);
};

run()
  .catch((err) => {
    console.error('Failed to seed admin user', err);
    process.exit(1);
  })
  .finally(() => process.exit());
