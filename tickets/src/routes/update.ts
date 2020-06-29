import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth, validateRequest, NotFoundError, NotAuthorizedError,
} from '@tixmaster/common';
import Ticket from '../models/Ticket';

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

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });

  await ticket.save();

  res.send(ticket);
});

export default router;
