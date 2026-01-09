import { Submission } from '../models/Submission.js';
import { User } from '../models/Placeholder.js';
import { validateSubmissionInput } from '../utils/validation.js';
import cloudinary from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new submission
 * POST /api/submissions
 * Requires: Authorization header with Bearer token
 * Optional: image file in multipart/form-data with key 'image'
 */
export async function createSubmission(req, res) {
  try {
    let { flavorName, bagColor, fontChoice, keyFlavors, bagImageUrl } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Parse keyFlavors if it's a JSON string (from FormData)
    if (typeof keyFlavors === 'string') {
      try {
        keyFlavors = JSON.parse(keyFlavors);
      } catch (e) {
        keyFlavors = [];
      }
    }

    // Check if user is banned
    const user = await User.findById(userId);
    if (user && user.isBanned) {
      return res.status(403).json({ error: 'User account has been banned' });
    }

    // Validate input
    const validation = validateSubmissionInput(flavorName, bagColor, fontChoice, keyFlavors);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Handle image upload if file provided
    let finalBagImageUrl = bagImageUrl || undefined;
    if (req.file) {
      try {
        // Upload to Cloudinary from buffer
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'designs',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });

        finalBagImageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        logger.error('Cloudinary upload failed during submission creation:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      }
    }

    // Create submission
    const newSubmission = await Submission.create({
      userId,
      flavorName: flavorName.trim(),
      bagColor: bagColor.trim(),
      fontChoice: fontChoice ? fontChoice.trim() : undefined,
      keyFlavors: keyFlavors && Array.isArray(keyFlavors) ? keyFlavors.map(f => f.trim()) : [],
      bagImageUrl: finalBagImageUrl,
    });

    // Return created submission
    return res.status(201).json({
      _id: newSubmission._id,
      userId: newSubmission.userId,
      flavorName: newSubmission.flavorName,
      bagColor: newSubmission.bagColor,
      fontChoice: newSubmission.fontChoice,
      keyFlavors: newSubmission.keyFlavors,
      bagImageUrl: newSubmission.bagImageUrl,
      voteCount: newSubmission.voteCount,
      createdAt: newSubmission.createdAt,
      updatedAt: newSubmission.updatedAt,
    });
  } catch (error) {
    console.error('Create submission error:', error);
    return res.status(500).json({ error: 'Failed to create submission' });
  }
}

/**
 * Get authenticated user's submissions
 * GET /api/submissions/my
 * Requires: Authorization header with Bearer token
 */
export async function getUserSubmissions(req, res) {
  try {
    const userId = req.user.userId; // From auth middleware

    // Fetch all submissions by this user, sorted by creation date (newest first)
    const userSubmissions = await Submission.find({ userId })
      .select('_id userId flavorName bagColor bagImageUrl fontChoice keyFlavors voteCount createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(userSubmissions);
  } catch (error) {
    console.error('Get user submissions error:', error);
    return res.status(500).json({ error: 'Failed to get submissions' });
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
      .select('_id userId flavorName bagColor bagImageUrl fontChoice keyFlavors voteCount createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('Get all submissions error:', error);
    return res.status(500).json({ error: 'Failed to get submissions' });
  }
}

/**
 * Remove a submission
 * DELETE /api/submissions/:id
 * Requires: Authorization header with Bearer token
 * Only the submission owner can delete it
 */
export async function removeSubmission(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // From auth middleware

    // Find the submission
    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Verify user owns the submission
    if (submission.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own submissions' });
    }

    // Delete the submission
    await Submission.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Submission deleted successfully', _id: id });
  } catch (error) {
    console.error('Remove submission error:', error);
    return res.status(500).json({ error: 'Failed to remove submission' });
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
