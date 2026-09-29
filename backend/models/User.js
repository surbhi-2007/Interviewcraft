import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, default: 'Software Engineer' },
  experienceLevel: { 
    type: String, 
    enum: ['Beginner', 'Mid-level', 'Senior'], 
    default: 'Mid-level' 
  },
  resumeText: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
