import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  flavorName: {
    type: String,
    required: true,
  },
  bagColor: {
    type: String,
    required: true,
  },
  bagImageUrl: {
    type: String,
    // TODO: Integrate Cloudinary or similar for image uploads
  },
  fontChoice: {
    type: String,
  },
  keyFlavors: {
    type: [String],
    // TODO: Validate against predefined flavor options
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Submission = mongoose.model('Submission', submissionSchema);
