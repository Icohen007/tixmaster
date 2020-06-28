import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tixmaster/common';

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

router.post('/api/tickets',
  requireAuth,
  validationChains,
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  });

export default router;
