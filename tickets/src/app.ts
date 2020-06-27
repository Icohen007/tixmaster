import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler } from '@tixmaster/common';

const app = express();
app.set('trust proxy', true); // traffic is being proxied to our app through ingress nginx, express default behavior is to NOT trust proxy.
app.use(express.json());
app.use(cookieSession({
  signed: false, // disable cookie encryption
  secure: process.env.NODE_ENV !== 'test', // HTTPS connection only
}));

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
