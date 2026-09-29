import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import interviewRoutes from './routes/interviewRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewcraft';

mongoose.connect(MONGO_URI)
  .then(() => console.log(`MongoDB Connected Successfully to ${MONGO_URI}`))
  .catch(err => {
    console.warn(`MongoDB Local Connection Notice: ${err.message}. (Server will handle requests with fallback schemas).`);
  });

app.listen(PORT, () => {
  console.log(`InterviewCraft Backend listening on http://localhost:${PORT}`);
});
