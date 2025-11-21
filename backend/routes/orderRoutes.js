import { Router } from 'express';

import { getConnection, query } from '../config/db.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';
import { getOrderItemsByOrderIds, getOrdersByUserId } from '../models/orderModel.js';

const router = Router();

router.post('/', optionalAuth, async (req, res, next) => {
  const {
    customer_name,
    customer_last_name,
    customer_email,
    customer_phone,
    customer_address,
    building,
    floor,
    postal_code,
    payment_method = 'cash',
    cart = []
  } = req.body;

  if (
    !customer_name ||
    !customer_last_name ||
    !customer_email ||
    !customer_phone ||
    !customer_address ||
    !building ||
    !floor ||
    !postal_code
  ) {
    return res.status(400).json({ message: 'Customer details are required' });
  }

  const normalizedPayment = String(payment_method).toLowerCase();
  if (!['cash', 'card'].includes(normalizedPayment)) {
    return res.status(400).json({ message: 'Invalid payment method' });
  }

  if (normalizedPayment === 'card') {
    return res
      .status(503)
      .json({ message: 'Card payments are temporarily unavailable while we finalize banking details.' });
  }

  if (!Array.isArray(cart) || !cart.length) {
    return res.status(400).json({ message: 'Cart cannot be empty' });
  }

  try {
    const normalizedCart = cart
      .map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      }))
      .filter((item) => item.productId && item.quantity > 0);

    if (!normalizedCart.length) {
      return res.status(400).json({ message: 'Invalid cart items' });
    }

    const productIds = [...new Set(normalizedCart.map((item) => item.productId))];
    const [products] = await query(
      `SELECT id, name, price, stock
         FROM products
        WHERE id IN (?) AND is_active = 1`,
      [productIds]
    );

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'One or more products are unavailable' });
    }

    const productMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    let total = 0;
    for (const item of normalizedCart) {
      const product = productMap[item.productId];
      if (!product) {
        return res.status(400).json({ message: 'Invalid product in cart' });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      total += Number(product.price) * item.quantity;
    }

    const connection = await getConnection();

    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.execute(
        `INSERT INTO orders (
            user_id,
            customer_name,
            last_name,
            customer_email,
            customer_phone,
            customer_address,
            building,
            floor,
            postal_code,
            payment_method,
            total,
            status
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          req.user?.id || null,
          customer_name,
          customer_last_name,
          customer_email,
          customer_phone,
          customer_address,
          building,
          floor,
          postal_code,
          normalizedPayment,
          total
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of normalizedCart) {
        const product = productMap[item.productId];
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES (?, ?, ?, ?)`,
          [orderId, product.id, item.quantity, product.price]
        );
        await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, product.id]);
      }

      await connection.commit();
      res.status(201).json({ success: true, orderId, total });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
});

router.get('/my', protect, async (req, res, next) => {
  try {
    const [orders] = await getOrdersByUserId(req.user.id);

    if (!orders.length) {
      return res.json([]);
    }

    const orderIds = orders.map((order) => order.id);
    const [items] = await getOrderItemsByOrderIds(orderIds);

    const grouped = items.reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const result = orders.map((order) => ({
      ...order,
      items: grouped[order.id] || []
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
