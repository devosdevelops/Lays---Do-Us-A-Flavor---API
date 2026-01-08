import { Router } from 'express';
import {
  getAllUsers,
  banUser,
  getAllSubmissions,
  removeSubmission,
  getAllVotes,
} from '../controllers/adminController.js';

const router = Router();

// TODO: Add admin authentication middleware to all routes

// GET /api/admin/users - View all users
// TODO: Protect with admin authentication middleware
router.get('/users', getAllUsers);

// POST /api/admin/users/:userId/ban - Ban a user
// TODO: Protect with admin authentication middleware
router.post('/users/:userId/ban', banUser);

// GET /api/admin/submissions - View all submissions
// TODO: Protect with admin authentication middleware
router.get('/submissions', getAllSubmissions);

// DELETE /api/admin/submissions/:submissionId - Remove submission
// TODO: Protect with admin authentication middleware
router.delete('/submissions/:submissionId', removeSubmission);

// GET /api/admin/votes - View all votes
// TODO: Protect with admin authentication middleware
router.get('/votes', getAllVotes);

export default router;
