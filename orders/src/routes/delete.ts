import express, { Request, Response } from 'express';
import {
  NotAuthorizedError, NotFoundError, OrderStatus, requireAuth,
} from '@tixmaster/common';
import Order from '../models/Order';
import OrderCancelledPublisher from '../events/publishers/OrderCancelledPublisher';
import natsWrapper from '../NatsWrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).send(order);
});

export default router;
