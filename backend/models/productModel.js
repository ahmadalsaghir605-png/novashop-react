import { query } from '../config/db.js';

export const getProductById = (id) =>
  query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);

export const archiveProduct = (id) =>
  query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);

export const countActiveProducts = () =>
  query('SELECT COUNT(*) AS totalProducts FROM products WHERE is_active = 1');
