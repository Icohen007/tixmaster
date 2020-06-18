import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validationChain = [
  body('email')
    .isEmail()
    .withMessage('Email must be vaild'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')];

router.post('/api/users/signup', validationChain, (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { email, password } = req.body;

  console.log('creating user with: ', email, password);

  return res.send({});
});

export default router;
