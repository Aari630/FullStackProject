import axios from 'axios';
import { VideoMetadata, TranscriptSegment, Question } from '../types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Video endpoints
export const uploadVideo = async (formData: FormData) => {
  const response = await api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
      // You can use this for progress tracking
      console.log(`Upload Progress: ${percentCompleted}%`);
    },
  });
  return response.data;
};

export const getVideos = async (): Promise<VideoMetadata[]> => {
  const response = await api.get('/videos');
  return response.data;
};

export const getVideoById = async (id: string): Promise<VideoMetadata> => {
  const response = await api.get(`/videos/${id}`);
  return response.data;
};

// Transcript endpoints
export const getTranscriptSegments = async (videoId: string): Promise<TranscriptSegment[]> => {
  const response = await api.get(`/transcripts/${videoId}`);
  return response.data;
};

// Question endpoints
export const getQuestions = async (videoId: string): Promise<Question[]> => {
  const response = await api.get(`/questions/${videoId}`);
  return response.data;
};

export const updateQuestion = async (questionId: string, questionData: Partial<Question>): Promise<Question> => {
  const response = await api.patch(`/questions/${questionId}`, questionData);
  return response.data;
};

export const exportQuestions = async (videoId: string): Promise<Blob> => {
  const response = await api.get(`/questions/${videoId}/export`, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;