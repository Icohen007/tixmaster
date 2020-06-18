import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import {
  currentUserRouter, signinRouter, signoutRouter, signupRouter,
} from './routes';
import { NotFoundError } from './errors';
import errorHandler from './middlewares/errorHandler';

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const initDb = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

initDb();
