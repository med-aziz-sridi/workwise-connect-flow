
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Placeholder for experience routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Experiences API endpoint' });
});

export default router;
