import express, { Request, Response } from 'express';
import { NotFoundError } from '@tixmaster/common';
import Ticket from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export default router;
