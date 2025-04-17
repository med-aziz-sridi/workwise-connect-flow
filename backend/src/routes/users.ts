
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Placeholder for user routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Users API endpoint' });
});

export default router;
