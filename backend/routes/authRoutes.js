import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';

const router = express.Router();

// Helper to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// 1. Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    // Create user in database
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      targetRole: targetRole || 'Software Developer',
      experienceLevel: experienceLevel || 'Beginner'
    });

    await user.save();

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel
      },
      token: `token_${user._id}_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user account.', details: error.message });
  }
});

// 2. Log In Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    // Verify password hash
    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        resumeText: user.resumeText
      },
      token: `token_${user._id}_${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.', details: error.message });
  }
});

// 3. Current User Profile
router.get('/me', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

export default router;
