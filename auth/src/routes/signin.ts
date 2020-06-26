import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@tixmaster/common';
import User from '../models/User';
import PasswordManager from '../services/PasswordManager';

const router = express.Router();

const validationChains = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password'),
];

router.post(
  '/api/users/signin',
  validationChains,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await PasswordManager.compare(existingUser.password, password);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET!,
    );
    // @ts-ignore
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  },
);
export default router;
