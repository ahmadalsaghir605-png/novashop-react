import { query } from '../config/db.js';

export const findPublicUserById = (id) =>
  query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [id]);

export const findUserByEmail = (email) =>
  query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

export const createUser = (name, email, passwordHash, role = 'customer') =>
  query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
    name,
    email,
    passwordHash,
    role
  ]);

export const countCustomers = () =>
  query("SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'");
