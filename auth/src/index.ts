import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import {
  currentUserRouter, signinRouter, signoutRouter, signupRouter,
} from './routes';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';

const app = express();
app.set('trust proxy', true); // traffic is being proxied to our app through ingress nginx, express default behavior is to NOT trust proxy.
app.use(express.json());
app.use(cookieSession({
  signed: false, // disable cookie encryption
  secure: true, // HTTPS connection only
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const initDb = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB1');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

initDb();
