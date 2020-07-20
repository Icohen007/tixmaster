import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError,
} from '@tixmaster/common';
import Ticket from '../models/Ticket';
import natsWrapper from '../NatsWrapper';
import TicketUpdatedPublisher from '../events/publishers/TicketUpdatedPublisher';

const router = express.Router();

const validationChains = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('You must supply title'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('price must be greater than 0'),
];

router.put('/api/tickets/:id', requireAuth, validationChains, validateRequest, async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserved ticket');
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });

  await ticket.save();

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  res.send(ticket);
});

export default router;
