import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Constants
const AI_SERVICE_URL = 'http://localhost:5000'; // Python AI service

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ 
      message: 'AI service is not available',
      error: err instanceof Error ? err.message : 'Unknown error' 
    });
  }
});

export default router;