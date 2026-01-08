import { Submission } from '../models/Submission.js';

// TODO: Implement submission creation with image upload
export async function createSubmission(req, res) {
  try {
    // TODO: Validate input (flavorName, bagColor, fontChoice, keyFlavors)
    // TODO: Handle image upload to Cloudinary or similar
    // TODO: Link submission to authenticated user
    res.status(201).json({ message: 'Submission creation not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create submission' });
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

// TODO: Implement getting all submissions
export async function getAllSubmissions(req, res) {
  try {
    // TODO: Fetch all submissions with pagination
    res.status(200).json({ message: 'Get all submissions not yet implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get submissions' });
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
