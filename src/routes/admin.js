import { Router } from 'express';
import {
  getAllUsers,
  banUser,
  getAllSubmissions,
  removeSubmission,
  selectWinner,
} from '../controllers/adminController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require authentication and admin role

// GET /api/admin/users - View all users
router.get('/users', authenticateToken, authorizeAdmin, getAllUsers);

// POST /api/admin/users/:userId/ban - Ban a user
router.post('/users/:userId/ban', authenticateToken, authorizeAdmin, banUser);

// GET /api/admin/submissions - View all submissions
router.get('/submissions', authenticateToken, authorizeAdmin, getAllSubmissions);

// DELETE /api/admin/submissions/:submissionId - Remove submission
router.delete('/submissions/:submissionId', authenticateToken, authorizeAdmin, removeSubmission);

// POST /api/admin/submissions/:submissionId/win - Select winner
router.post('/submissions/:submissionId/win', authenticateToken, authorizeAdmin, selectWinner);

export default router;
