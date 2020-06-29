import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth, validateRequest, NotFoundError, NotAuthorizedError,
} from '@tixmaster/common';
import Ticket from '../models/Ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(ticket);
});

export default router;
