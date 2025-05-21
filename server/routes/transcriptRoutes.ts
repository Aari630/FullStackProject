import express from 'express';
import TranscriptSegment from '../models/Transcript';
import mongoose from 'mongoose';

const router = express.Router();

// Get all transcript segments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    
    const segments = await TranscriptSegment.find({ videoId })
      .sort({ startTime: 1 });
      
    res.json(segments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transcript segments', error: err });
  }
});

// Get a specific transcript segment
router.get('/segment/:segmentId', async (req, res) => {
  try {
    const segmentId = req.params.segmentId;
    
    // Validate segmentId
    if (!mongoose.Types.ObjectId.isValid(segmentId)) {
      return res.status(400).json({ message: 'Invalid segment ID' });
    }
    
    const segment = await TranscriptSegment.findById(segmentId);
    
    if (!segment) {
      return res.status(404).json({ message: 'Transcript segment not found' });
    }
    
    res.json(segment);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transcript segment', error: err });
  }
});

// Update a transcript segment
router.patch('/segment/:segmentId', async (req, res) => {
  try {
    const segmentId = req.params.segmentId;
    
    // Validate segmentId
    if (!mongoose.Types.ObjectId.isValid(segmentId)) {
      return res.status(400).json({ message: 'Invalid segment ID' });
    }
    
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const updatedSegment = await TranscriptSegment.findByIdAndUpdate(
      segmentId,
      { text },
      { new: true }
    );
    
    if (!updatedSegment) {
      return res.status(404).json({ message: 'Transcript segment not found' });
    }
    
    res.json(updatedSegment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating transcript segment', error: err });
  }
});

export default router;