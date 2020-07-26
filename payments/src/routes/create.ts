import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError, NotFoundError, OrderStatus,
  requireAuth,
  validateRequest,
} from '@tixmaster/common';
import { body } from 'express-validator';
import Order from '../models/Order';
import stripe from '../stripe';
import Payment from '../models/Payment';
import PaymentCreatedPublisher from '../events/publishers/PaymentCreatedPublisher';
import natsWrapper from '../NatsWrapper';

const router = express.Router();

const validationChains = [
  body('token')
    .notEmpty()
    .withMessage('You must supply valid token'),
  body('orderId')
    .notEmpty()
    .withMessage('You must supply valid order id'),
];

router.post('/api/payments', requireAuth, validationChains, validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cant charge a Cancelled Order');
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });

  const payment = Payment.build({
    orderId: order.id,
    stripeId: charge.id,
  });
  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });

  res.status(201).send({ id: payment.id });
});

export default router;
