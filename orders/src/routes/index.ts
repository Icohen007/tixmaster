import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  res.status(200).send({});
});

export { router as indexOrderRouter };
export { default as createOrderRouter } from './create';
export { default as showOrderRouter } from './show';
export { default as deleteOrderRouter } from './delete';
