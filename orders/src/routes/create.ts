import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError, OrderStatus,
  requireAuth,
  validateRequest,
} from '@tixmaster/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket';
import Order from '../models/Order';
import OrderCreatedPublisher from '../events/publishers/OrderCreatedPublisher';
import natsWrapper from '../NatsWrapper';

const router = express.Router();

const validationChains = [
  body('ticketId')
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('You must supply valid ticketId'),
];

const EXPIRATION_SECONDS = 15 * 60;

function generateExpirationDate() {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_SECONDS);
  return expiresAt;
}

router.post('/api/orders', requireAuth, validationChains, validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.body.ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  const newOrder = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: generateExpirationDate(),
    ticket,
  });

  await newOrder.save();

  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: newOrder._id,
    status: newOrder.status,
    userId: newOrder.userId,
    expiresAt: newOrder.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  res.status(201).send(newOrder);
});

export default router;
