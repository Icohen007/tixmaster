import express from 'express';
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

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
