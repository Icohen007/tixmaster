import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@tixmaster/common';
import User from '../models/User';

const router = express.Router();

const validationChain = [
  body('email')
    .isEmail()
    .withMessage('Email must be vaild'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')];

router.post('/api/users/signup', validationChain, validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);
  // @ts-ignore
  req.session = { jwt: userJwt };

  res.status(201).send(user);
});

export default router;
