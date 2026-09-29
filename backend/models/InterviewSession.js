import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['ai', 'user'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metrics: {
    wpm: { type: Number, default: 0 },
    fillerWordCount: { type: Number, default: 0 },
    starDetection: {
      situation: Boolean,
      task: Boolean,
      action: Boolean,
      result: Boolean
    }
  }
});

const InterviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  personality: { 
    type: String, 
    enum: ['Coach', 'Challenger', 'Professional'], 
    required: true 
  },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('InterviewSession', InterviewSessionSchema);
