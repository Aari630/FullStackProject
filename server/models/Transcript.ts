import mongoose from 'mongoose';

export interface ITranscriptSegment {
  _id: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  startTime: number;
  endTime: number;
  text: string;
}

const transcriptSegmentSchema = new mongoose.Schema<ITranscriptSegment>({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

// Create index for faster lookups
transcriptSegmentSchema.index({ videoId: 1, startTime: 1 });

export default mongoose.model<ITranscriptSegment>('TranscriptSegment', transcriptSegmentSchema);