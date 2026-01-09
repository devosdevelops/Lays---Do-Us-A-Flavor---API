import { Router } from 'express';
import userRoutes from './users.js';
import submissionRoutes from './submissions.js';
import voteRoutes from './votes.js';
import adminRoutes from './admin.js';
import uploadRoutes from './upload.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount route handlers
router.use('/users', userRoutes);
router.use('/submissions', submissionRoutes);
router.use('/votes', voteRoutes);
router.use('/admin', adminRoutes);
router.use('/', uploadRoutes);
export default router;
