import { query } from '../config/db.js';

export const getOrdersByUserId = (userId) =>
  query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);

export const getOrderItemsByOrderIds = (orderIds) =>
  query(
    `SELECT oi.*, p.name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id IN (?)`,
    [orderIds]
  );

export const getAdminOrders = () =>
  query(
    `SELECT o.*, u.name AS user_name
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 25`
  );

export const getAdminOrderById = (orderId) =>
  query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
      WHERE o.id = ?
      LIMIT 1`,
    [orderId]
  );

export const getOrderItemsByOrderId = (orderId) =>
  query(
    `SELECT oi.*, p.name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?`,
    [orderId]
  );

export const countOrders = () => query('SELECT COUNT(*) AS totalOrders FROM orders');
export const sumRevenue = () =>
  query('SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders');
