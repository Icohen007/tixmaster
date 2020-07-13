import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@tixmaster/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

const validationChains = [
  body('ticketId')
    .notEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('You must supply valid ticketId'),
];

router.post('/api/orders', requireAuth, validationChains, validateRequest, async (req: Request, res: Response) => {
  res.status(200).send({});
});

export default router;
