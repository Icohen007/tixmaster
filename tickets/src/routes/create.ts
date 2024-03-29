import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tixmaster/common';
import TicketCreatedPublisher from '../events/publishers/TicketCreatedPublisher';
import Ticket from '../models/Ticket';
import natsWrapper from '../NatsWrapper';

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

router.post('/api/tickets', requireAuth, validationChains, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
  await ticket.save();

  await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
  });

  res.status(201).send(ticket);
});

export default router;
