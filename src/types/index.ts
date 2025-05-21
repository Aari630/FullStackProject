export interface VideoMetadata {
  _id: string;
  title: string;
  fileName: string;
  fileSize: number;
  duration: number;
  uploadDate: string;
  processingStatus: 'pending' | 'transcribing' | 'generating-questions' | 'completed' | 'failed';
  errorMessage?: string;
}

export interface TranscriptSegment {
  _id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface Question {
  _id: string;
  videoId: string;
  segmentId: string;
  text: string;
  options: QuestionOption[];
  correctOptionIndex: number;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface ProcessingStatus {
  status: 'pending' | 'transcribing' | 'generating-questions' | 'completed' | 'failed';
  progress: number;
  message: string;
}