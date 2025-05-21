import mongoose from 'mongoose';

export interface IQuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  _id: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  segmentId: mongoose.Types.ObjectId;
  text: string;
  options: IQuestionOption[];
  correctOptionIndex: number;
}

const questionOptionSchema = new mongoose.Schema<IQuestionOption>({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = new mongoose.Schema<IQuestion>({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  segmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TranscriptSegment',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [questionOptionSchema],
    required: true,
    validate: {
      validator: function(options: IQuestionOption[]) {
        return options.length >= 2 && options.length <= 5;
      },
      message: 'Questions must have between 2 and 5 options',
    },
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Create index for faster lookups
questionSchema.index({ videoId: 1, segmentId: 1 });

export default mongoose.model<IQuestion>('Question', questionSchema);