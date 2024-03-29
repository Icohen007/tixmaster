import express, { Request, Response } from 'express';
import Ticket from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });
  res.status(200).send(tickets);
});

export { router as indexTicketRouter };
export { default as createTicketRouter } from './create';
export { default as showTicketRouter } from './show';
export { default as updateTicketRouter } from './update';
