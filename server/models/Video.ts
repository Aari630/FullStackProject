import mongoose from 'mongoose';

export interface IVideo {
  _id: mongoose.Types.ObjectId;
  title: string;
  fileName: string;
  fileSize: number;
  duration: number;
  uploadDate: Date;
  processingStatus: 'pending' | 'transcribing' | 'generating-questions' | 'completed' | 'failed';
  errorMessage?: string;
}

const videoSchema = new mongoose.Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'transcribing', 'generating-questions', 'completed', 'failed'],
    default: 'pending',
  },
  errorMessage: {
    type: String,
  },
});

export default mongoose.model<IVideo>('Video', videoSchema);