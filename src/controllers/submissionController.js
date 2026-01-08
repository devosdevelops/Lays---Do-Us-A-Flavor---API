import { Submission } from '../models/Submission.js';
import { validateSubmissionInput } from '../utils/validation.js';

/**
 * Create a new submission
 * POST /api/submissions
 * Requires: Authorization header with Bearer token
 */
export async function createSubmission(req, res) {
  try {
    const { flavorName, bagColor, fontChoice, keyFlavors } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    const validation = validateSubmissionInput(flavorName, bagColor, fontChoice, keyFlavors);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Create submission
    const newSubmission = await Submission.create({
      userId,
      flavorName: flavorName.trim(),
      bagColor: bagColor.trim(),
      fontChoice: fontChoice ? fontChoice.trim() : undefined,
      keyFlavors: keyFlavors && Array.isArray(keyFlavors) ? keyFlavors.map(f => f.trim()) : [],
    });

    // Return created submission
    return res.status(201).json({
      _id: newSubmission._id,
      userId: newSubmission.userId,
      flavorName: newSubmission.flavorName,
      bagColor: newSubmission.bagColor,
      fontChoice: newSubmission.fontChoice,
      keyFlavors: newSubmission.keyFlavors,
      voteCount: newSubmission.voteCount,
      createdAt: newSubmission.createdAt,
      updatedAt: newSubmission.updatedAt,
    });
  } catch (error) {
    console.error('Create submission error:', error);
    return res.status(500).json({ error: 'Failed to create submission' });
  }
}

// TODO: Implement getting user's submissions
export async function getUserSubmissions(req, res) {
  try {
    // TODO: Get user ID from JWT token
    // TODO: Fetch all submissions by user
    res.status(200).json({ message: 'Get user submissions not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get submissions' });
  }
}

/**
 * Get all submissions
 * GET /api/submissions
 * Public endpoint - no authentication required
 */
export async function getAllSubmissions(req, res) {
  try {
    // Fetch all submissions sorted by creation date (newest first)
    const submissions = await Submission.find()
      .select('_id userId flavorName bagColor fontChoice keyFlavors voteCount createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Get all submissions error:', error);
    return res.status(500).json({ error: 'Failed to get submissions' });
  }
}

// TODO: Implement submission deletion
export async function removeSubmission(req, res) {
  try {
    // TODO: Verify user owns the submission
    // TODO: Delete submission by ID
    res.status(200).json({ message: 'Submission removal not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove submission' });
  }
}

// TODO: NICE-TO-HAVE: Implement submission editing
export async function editSubmission(req, res) {
  try {
    // TODO: Verify user owns the submission
    // TODO: Update submission fields
    res.status(200).json({ message: 'Submission editing not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit submission' });
  }
}

// TODO: NICE-TO-HAVE: Implement screenshot export
export async function exportScreenshot(req, res) {
  try {
    // TODO: Generate screenshot of flavor design
    res.status(200).json({ message: 'Screenshot export not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export screenshot' });
  }
}
