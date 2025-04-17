
import { Router } from 'express';
import { getAllJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobs';
import { authenticateToken, checkRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', authenticateToken, checkRole(['provider']), createJob);
router.put('/:id', authenticateToken, checkRole(['provider']), updateJob);
router.delete('/:id', authenticateToken, checkRole(['provider']), deleteJob);

export default router;
