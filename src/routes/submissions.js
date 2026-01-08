import { Router } from 'express';
import {
  createSubmission,
  getUserSubmissions,
  getAllSubmissions,
  removeSubmission,
  editSubmission,
  exportScreenshot,
} from '../controllers/submissionController.js';

const router = Router();

// TODO: Add authentication middleware for protected routes

// POST /api/submissions - Create new submission
// TODO: Protect with authentication middleware
router.post('/', createSubmission);

// GET /api/submissions/my - Get authenticated user's submissions
// TODO: Protect with authentication middleware
router.get('/my', getUserSubmissions);

// GET /api/submissions - Get all submissions (paginated)
router.get('/', getAllSubmissions);

// DELETE /api/submissions/:id - Remove submission
// TODO: Protect with authentication middleware, verify ownership
router.delete('/:id', removeSubmission);

// PUT /api/submissions/:id - Edit submission
// TODO: Protect with authentication middleware, verify ownership
// TODO: Implement in later phase
router.put('/:id', editSubmission);

// GET /api/submissions/:id/export - Export screenshot
// TODO: Implement screenshot export in later phase
router.get('/:id/export', exportScreenshot);

export default router;
