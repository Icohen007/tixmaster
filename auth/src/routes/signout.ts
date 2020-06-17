import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('test signout');
});

export default router;
