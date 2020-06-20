import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

// eslint-disable-next-line consistent-return
const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_SECRET!) as UserPayload;
  } catch (err) {}

  next();
};

export default currentUser;
