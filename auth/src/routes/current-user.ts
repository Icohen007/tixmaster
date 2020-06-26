import express from 'express';
import { currentUser } from '@tixmaster/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;
