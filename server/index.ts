import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import { json } from 'body-parser';
import videoRoutes from './routes/videoRoutes';
import transcriptRoutes from './routes/transcriptRoutes';
import questionRoutes from './routes/questionRoutes';
import aiRoutes from './routes/aiRoutes';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/lectureQuiz')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Set up socket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('subscribeToVideo', (videoId) => {
    console.log(`Client subscribed to video: ${videoId}`);
    socket.join(`video-${videoId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make socket.io available to routes
app.set('io', io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/transcripts', transcriptRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };