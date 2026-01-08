import { User } from '../models/Placeholder.js';
import { Submission } from '../models/Submission.js';

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export async function getAllUsers(req, res) {
  try {
    // Fetch all users, sorted by creation date (newest first)
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ error: 'Failed to get users' });
  }
}

/**
 * Ban a user (admin only)
 * POST /api/admin/users/:userId/ban
 */
export async function banUser(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent banning self
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }

    // Ban the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      message: 'User banned successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Ban user error:', error);
    return res.status(500).json({ error: 'Failed to ban user' });
  }
}

/**
 * Get all submissions (admin only)
 * GET /api/admin/submissions
 */
export async function getAllSubmissions(req, res) {
  try {
    // Fetch all submissions, sorted by creation date (newest first)
    const submissions = await Submission.find()
      .populate('userId', 'username email isBanned')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Get all submissions error:', error);
    return res.status(500).json({ error: 'Failed to get submissions' });
  }
}

/**
 * Remove a submission (admin only)
 * DELETE /api/admin/submissions/:submissionId
 */
export async function removeSubmission(req, res) {
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

    // Delete the submission
    await Submission.findByIdAndDelete(submissionId);

    return res.status(200).json({
      message: 'Submission removed successfully',
      _id: submissionId,
    });
  } catch (error) {
    console.error('Remove submission error:', error);
    return res.status(500).json({ error: 'Failed to remove submission' });
  }
}
