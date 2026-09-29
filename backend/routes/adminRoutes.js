import express from 'express';
import User from '../models/User.js';
import InterviewSession from '../models/InterviewSession.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Get Admin Overview Data from MongoDB
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await InterviewSession.countDocuments();
    const completedSessions = await InterviewSession.countDocuments({ status: 'completed' });

    // Calculate system average score from Feedback collection
    const feedbacks = await Feedback.find();
    let avgOverall = 8.2;
    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, f) => acc + (f.scores?.overall || 8), 0);
      avgOverall = (sum / feedbacks.length).toFixed(1);
    }

    // Fetch user activity list
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(20);
    
    // Enrich users with session counts
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const sessionCount = await InterviewSession.countDocuments({ userId: u._id });
        const userFeedbacks = await Feedback.find({ userId: u._id });
        let userAvg = 0;
        if (userFeedbacks.length > 0) {
          const userSum = userFeedbacks.reduce((acc, f) => acc + (f.scores?.overall || 0), 0);
          userAvg = (userSum / userFeedbacks.length).toFixed(1);
        } else {
          userAvg = 'N/A';
        }

        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.targetRole || 'Software Developer',
          experienceLevel: u.experienceLevel || 'Beginner',
          sessions: sessionCount,
          avgScore: userAvg,
          status: 'Active',
          createdAt: u.createdAt
        };
      })
    );

    res.json({
      metrics: {
        totalUsers,
        totalSessions,
        completedSessions,
        avgScore: avgOverall
      },
      candidates: usersWithStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin overview', details: error.message });
  }
});

export default router;
