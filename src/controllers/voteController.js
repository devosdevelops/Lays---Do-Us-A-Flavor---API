import { Vote } from '../models/Vote.js';
import { Submission } from '../models/Submission.js';

/**
 * Submit a vote for a submission
 * POST /api/votes
 * Requires: Authorization header with Bearer token
 */
export async function submitVote(req, res) {
  try {
    const { submissionId } = req.body;
    const userId = req.user.userId; // From auth middleware

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

// TODO: Implement getting vote counts
export async function getVoteCounts(req, res) {
  try {
    // TODO: Get submission ID from params
    // TODO: Return vote count for submission
    res.status(200).json({ message: 'Get vote counts not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get vote counts' });
  }
}

// TODO: Implement getting all votes (for admin)
export async function getAllVotes(req, res) {
  try {
    // TODO: Verify user is admin
    // TODO: Fetch all votes with pagination
    res.status(200).json({ message: 'Get all votes not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get votes' });
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
