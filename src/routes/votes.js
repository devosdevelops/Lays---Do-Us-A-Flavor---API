import { Router } from 'express';
import {
  submitVote,
  getVoteCounts,
  getAllVotes,
  removeVote,
} from '../controllers/voteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/votes - Submit vote for a submission
// Requires: Authorization header with Bearer token
router.post('/', authenticateToken, submitVote);

// GET /api/votes/:submissionId - Get vote count for a submission
router.get('/:submissionId', getVoteCounts);

// GET /api/votes - Get all votes (admin only)
// TODO: Protect with admin authentication middleware
router.get('/', getAllVotes);

// DELETE /api/votes/:id - Remove vote
// TODO: Protect with authentication middleware, verify ownership
// TODO: Implement in later phase
router.delete('/:id', removeVote);

export default router;
