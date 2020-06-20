import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// eslint-disable-next-line consistent-return
router.get('/api/users/currentuser', (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export default router;
