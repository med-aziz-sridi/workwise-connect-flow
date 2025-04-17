
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Placeholder for notification routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Notifications API endpoint' });
});

export default router;
