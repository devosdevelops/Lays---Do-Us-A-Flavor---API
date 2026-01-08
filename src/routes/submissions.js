import { Router } from 'express';
import {
  createSubmission,
  getUserSubmissions,
  getAllSubmissions,
  removeSubmission,
  editSubmission,
  exportScreenshot,
} from '../controllers/submissionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/submissions - Create new submission
// Requires: Authorization header with Bearer token
router.post('/', authenticateToken, createSubmission);

// GET /api/submissions/my - Get authenticated user's submissions
// Requires: Authorization header with Bearer token
router.get('/my', authenticateToken, getUserSubmissions);

// GET /api/submissions - Get all submissions (paginated)
router.get('/', getAllSubmissions);

// DELETE /api/submissions/:id - Remove submission
// Requires: Authorization header with Bearer token
// Only the submission owner can delete it
router.delete('/:id', authenticateToken, removeSubmission);

// PUT /api/submissions/:id - Edit submission
// TODO: Protect with authentication middleware, verify ownership
// TODO: Implement in later phase
router.put('/:id', editSubmission);

// GET /api/submissions/:id/export - Export screenshot
// TODO: Implement screenshot export in later phase
router.get('/:id/export', exportScreenshot);

export default router;
