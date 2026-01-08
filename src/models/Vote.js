import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TODO: Add unique index to prevent duplicate votes from same user for same submission
voteSchema.index({ userId: 1, submissionId: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);
