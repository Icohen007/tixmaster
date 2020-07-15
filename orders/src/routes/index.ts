import express, { Request, Response } from 'express';
import { requireAuth } from '@tixmaster/common';
import Order from '../models/Order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
  res.send(orders);
});

export { router as indexOrderRouter };
export { default as createOrderRouter } from './create';
export { default as showOrderRouter } from './show';
export { default as deleteOrderRouter } from './delete';
