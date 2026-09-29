import mongoose from 'mongoose';

const ImprovementSuggestionSchema = new mongoose.Schema({
  originalQuestion: String,
  originalAnswer: String,
  suggestedRewrite: String,
  explanation: String
});

const FeedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: {
    overall: { type: Number, min: 1, max: 10, required: true },
    clarity: { type: Number, min: 1, max: 10, required: true },
    relevance: { type: Number, min: 1, max: 10, required: true },
    structure: { type: Number, min: 1, max: 10, required: true }
  },
  starMethodScore: {
    situation: Number,
    task: Number,
    action: Number,
    result: Number
  },
  fillerWordsSummary: {
    totalCount: { type: Number, default: 0 },
    topWords: [{ word: String, count: Number }],
    avgPacingWpm: { type: Number, default: 0 }
  },
  keyStrengths: [String],
  areasToImprove: [String],
  trySayingItLikeThis: [ImprovementSuggestionSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', FeedbackSchema);
