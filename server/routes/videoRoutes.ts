import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Server as SocketServer } from 'socket.io';
import Video from '../models/Video';
import { transcribeVideo } from '../services/transcriptionService';
import { generateQuestions } from '../services/questionGenerationService';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'video/mp4') {
      return cb(new Error('Only MP4 videos are allowed'));
    }
    cb(null, true);
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching videos', error: err });
  }
});

// Get a single video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching video', error: err });
  }
});

// Upload a new video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    // Create video metadata in database
    const video = new Video({
      title: req.body.title || req.file.originalname.replace('.mp4', ''),
      fileName: req.file.filename,
      fileSize: req.file.size,
      duration: 0, // Will be updated after processing
      processingStatus: 'pending',
    });

    const savedVideo = await video.save();
    
    // Process the video asynchronously
    processVideo(savedVideo._id.toString(), req.file.path, req.app.get('io'));
    
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading video', error: err });
  }
});

// Delete a video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete video file
    const filePath = path.join(__dirname, '../../uploads', video.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete video from database
    await Video.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting video', error: err });
  }
});

// Helper function to process video asynchronously
async function processVideo(videoId: string, filePath: string, io: SocketServer) {
  try {
    // Update video status to transcribing
    await Video.findByIdAndUpdate(videoId, { processingStatus: 'transcribing' });
    
    // Send status update to connected clients
    io.to(`video-${videoId}`).emit('processingUpdate', {
      status: 'transcribing',
      progress: 0,
      message: 'Starting transcription...'
    });
    
    // Transcribe the video
    const { segments, duration } = await transcribeVideo(filePath, (progress) => {
      io.to(`video-${videoId}`).emit('processingUpdate', {
        status: 'transcribing',
        progress: Math.round(progress * 50), // Transcription is 50% of the total process
        message: `Transcribing video: ${Math.round(progress * 100)}% complete`
      });
    });
    
    // Update video with duration info
    await Video.findByIdAndUpdate(videoId, { 
      duration, 
      processingStatus: 'generating-questions' 
    });
    
    // Generate questions for each segment
    io.to(`video-${videoId}`).emit('processingUpdate', {
      status: 'generating-questions',
      progress: 50,
      message: 'Starting question generation...'
    });
    
    await generateQuestions(videoId, segments, (progress) => {
      io.to(`video-${videoId}`).emit('processingUpdate', {
        status: 'generating-questions',
        progress: 50 + Math.round(progress * 50), // Question generation is the other 50%
        message: `Generating questions: ${Math.round(progress * 100)}% complete`
      });
    });
    
    // Update video status to completed
    await Video.findByIdAndUpdate(videoId, { processingStatus: 'completed' });
    
    // Send final update
    io.to(`video-${videoId}`).emit('processingUpdate', {
      status: 'completed',
      progress: 100,
      message: 'Processing completed'
    });
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Update video status to failed
    await Video.findByIdAndUpdate(videoId, { 
      processingStatus: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Send error update
    io.to(`video-${videoId}`).emit('processingUpdate', {
      status: 'failed',
      progress: 0,
      message: 'Processing failed'
    });
  }
}

export default router;