import { Vote } from '../models/Vote.js';
import { Submission } from '../models/Submission.js';
import { User } from '../models/Placeholder.js';

/**
 * Submit a vote for a submission
 * POST /api/votes
 * Requires: Authorization header with Bearer token
 */
export async function submitVote(req, res) {
  try {
    const { submissionId } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Check if user is banned
    const user = await User.findById(userId);
    if (user && user.isBanned) {
      return res.status(403).json({ error: 'User account has been banned' });
    }

    // Validate submissionId
    if (!submissionId || typeof submissionId !== 'string') {
      return res.status(400).json({ error: 'Submission ID is required' });
    }

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user already voted for this submission
    const existingVote = await Vote.findOne({ userId, submissionId });
    if (existingVote) {
      return res.status(409).json({ error: 'You have already voted for this submission' });
    }

    // Create vote record
    const newVote = await Vote.create({
      userId,
      submissionId,
    });

    // Increment submission's voteCount
    await Submission.findByIdAndUpdate(
      submissionId,
      { $inc: { voteCount: 1 } },
      { new: true }
    );

    return res.status(201).json({
      _id: newVote._id,
      userId: newVote.userId,
      submissionId: newVote.submissionId,
      createdAt: newVote.createdAt,
    });
  } catch (error) {
    console.error('Submit vote error:', error);
    return res.status(500).json({ error: 'Failed to submit vote' });
  }
}

/**
 * Get vote count for a submission
 * GET /api/votes/:submissionId
 * Public endpoint - no authentication required
 */
export async function getVoteCounts(req, res) {
  try {
    const { submissionId } = req.params;

    if (!submissionId) {
      return res.status(400).json({ error: 'Submission ID is required' });
    }

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Get vote count from submission document
    return res.status(200).json({
      submissionId: submission._id,
      voteCount: submission.voteCount,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt,
    });
  } catch (error) {
    console.error('Get vote counts error:', error);
    return res.status(500).json({ error: 'Failed to get vote counts' });
  }
}

/**
 * Get all votes (admin only)
 * GET /api/votes
 * Requires: Admin authorization
 */
export async function getAllVotes(req, res) {
  try {
    // Fetch all votes sorted by creation date (newest first)
    // Populate userId and submissionId for complete info
    const votes = await Vote.find()
      .populate('userId', 'username email')
      .populate('submissionId', 'flavorName bagColor')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(votes);
  } catch (error) {
    console.error('Get all votes error:', error);
    return res.status(500).json({ error: 'Failed to get votes' });
  }
}

// TODO: NICE-TO-HAVE: Implement vote removal
export async function removeVote(req, res) {
  try {
    // TODO: Verify user owns the vote
    // TODO: Delete vote record
    // TODO: Decrement submission voteCount
    res.status(200).json({ message: 'Vote removal not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove vote' });
  }
}
