
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Placeholder for project routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Projects API endpoint' });
});

export default router;
