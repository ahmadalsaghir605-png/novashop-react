import { Router } from 'express';

import { protect, requireRole } from '../middleware/authMiddleware.js';
import {
  countOrders,
  getAdminOrderById,
  getAdminOrders,
  getOrderItemsByOrderId,
  sumRevenue
} from '../models/orderModel.js';
import { countActiveProducts } from '../models/productModel.js';
import { countCustomers } from '../models/userModel.js';

const router = Router();
const withAuth = [protect, requireRole('admin', 'manager')];

router.get('/stats', withAuth, async (_req, res, next) => {
  try {
    const [[{ totalOrders }]] = await countOrders();
    const [[{ totalRevenue }]] = await sumRevenue();
    const [[{ totalProducts }]] = await countActiveProducts();
    const [[{ totalCustomers }]] = await countCustomers();

    res.json({ totalOrders, totalRevenue, totalProducts, totalCustomers });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', withAuth, async (_req, res, next) => {
  try {
    const [orders] = await getAdminOrders();

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', withAuth, async (req, res, next) => {
  try {
    const [orders] = await getAdminOrderById(req.params.id);

    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await getOrderItemsByOrderId(req.params.id);

    res.json({ ...orders[0], items });
  } catch (error) {
    next(error);
  }
});

export default router;
