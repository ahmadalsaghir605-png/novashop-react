import { Router } from 'express';
import { query } from '../config/db.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { archiveProduct, getProductById } from '../models/productModel.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let sql = 'SELECT id, name, description, price, category, sku, stock, is_active, created_at FROM products WHERE 1=1';
    const params = [];

    sql += ' AND is_active = 1';

    if (search) {
      const term = `%${search}%`;
      sql += ' AND (name LIKE ? OR description LIKE ? OR sku LIKE ?)';
      params.push(term, term, term);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await getProductById(req.params.id);
    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, requireRole('admin', 'manager'), async (req, res, next) => {
  try {
    const { name, description, price, category, sku, stock, is_active = 1 } = req.body;

    if (!name || !price || !sku) {
      return res.status(400).json({ message: 'Name, SKU and price are required' });
    }

    const [result] = await query(
      'INSERT INTO products (name, description, price, category, sku, stock, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        description || '',
        Number(price) || 0,
        category || 'General',
        sku,
        Number.isNaN(Number(stock)) ? 0 : Number(stock),
        is_active ? 1 : 0
      ]
    );

    const [productRows] = await getProductById(result.insertId);
    res.status(201).json(productRows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', protect, requireRole('admin', 'manager'), async (req, res, next) => {
  try {
    const { name, description, price, category, sku, stock, is_active } = req.body;
    const normalizedPrice = Number(price);
    const normalizedStock = Number(stock);
    const updates = [
      name,
      description,
      Number.isNaN(normalizedPrice) ? 0 : normalizedPrice,
      category,
      sku,
      Number.isNaN(normalizedStock) ? 0 : normalizedStock,
      is_active ? 1 : 0,
      req.params.id
    ];

    const [result] = await query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, category = ?, sku = ?, stock = ?, is_active = ?
       WHERE id = ?`,
      updates
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [rows] = await getProductById(req.params.id);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const [result] = await archiveProduct(req.params.id);
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product archived' });
  } catch (error) {
    next(error);
  }
});

export default router;
