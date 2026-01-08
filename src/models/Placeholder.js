import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // TODO: Implement password hashing with bcrypt
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // TODO: Add banned flag for admin functionality
  isBanned: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model('User', userSchema);
