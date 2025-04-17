
import { Router } from 'express';
import { signUp, signIn, signOut, getCurrentUser } from '../controllers/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
