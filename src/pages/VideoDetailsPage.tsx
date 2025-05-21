import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, FileText, HelpCircle, Download, RefreshCw } from 'lucide-react';
import { getVideoById, getTranscriptSegments, getQuestions, exportQuestions } from '../lib/api';
import { formatTime } from '../lib/utils';
import { Question, TranscriptSegment } from '../types';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const VideoDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState({
    status: 'pending',
    progress: 0,
    message: 'Initializing...'
  });

  // Socket.io connection for real-time updates
  useEffect(() => {
    if (!id) return;

    const socket = io('http://localhost:3001');
    
    socket.on('connect', () => {
      console.log('Connected to websocket');
      socket.emit('subscribeToVideo', id);
    });
    
    socket.on('processingUpdate', (data) => {
      setProcessingStatus(data);
    });
    
    return () => {
      socket.off('processingUpdate');
      socket.disconnect();
    };
  }, [id]);

  // Fetch video details
  const { data: video, isLoading: isLoadingVideo, error: videoError } = useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id || ''),
    enabled: !!id,
    refetchInterval: processingStatus.status !== 'completed' && processingStatus.status !== 'failed' ? 5000 : false,
  });

  // Fetch transcript segments
  const { 
    data: segments, 
    isLoading: isLoadingSegments,
    refetch: refetchSegments
  } = useQuery({
    queryKey: ['segments', id],
    queryFn: () => getTranscriptSegments(id || ''),
    enabled: !!id && (processingStatus.status === 'generating-questions' || processingStatus.status === 'completed'),
  });

  // Fetch questions
  const { 
    data: questions, 
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions
  } = useQuery({
    queryKey: ['questions', id],
    queryFn: () => getQuestions(id || ''),
    enabled: !!id && processingStatus.status === 'completed',
  });

  // Set the first segment as active once loaded
  useEffect(() => {
    if (segments && segments.length > 0 && !activeSegmentId) {
      setActiveSegmentId(segments[0]._id);
    }
  }, [segments, activeSegmentId]);

  // Handle export questions
  const handleExportQuestions = async () => {
    if (!id) return;
    
    try {
      const blob = await exportQuestions(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questions-${id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Questions exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export questions');
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refetchSegments();
    refetchQuestions();
  };

  // Filter questions by segment
  const getQuestionsForSegment = (segmentId: string): Question[] => {
    if (!questions) return [];
    return questions.filter(q => q.segmentId === segmentId);
  };

  if (isLoadingVideo) {
    return <div className="flex justify-center py-12">Loading video details...</div>;
  }

  if (videoError || !video) {
    return <div className="text-red-500 py-12">Error loading video details</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
          {processingStatus.status === 'completed' && (
            <button
              onClick={handleExportQuestions}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Questions
            </button>
          )}
        </div>
      </div>
      
      {/* Processing status */}
      {processingStatus.status !== 'completed' && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Processing Status</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {processingStatus.message}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {processingStatus.progress}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${processingStatus.progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Status details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${processingStatus.status === 'transcribing' ? 'bg-blue-50 border-blue-200' : processingStatus.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center">
                <FileText className={`h-5 w-5 mr-2 ${processingStatus.status === 'transcribing' ? 'text-blue-500' : processingStatus.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="font-medium">Transcription</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${processingStatus.status === 'generating-questions' ? 'bg-blue-50 border-blue-200' : processingStatus.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center">
                <HelpCircle className={`h-5 w-5 mr-2 ${processingStatus.status === 'generating-questions' ? 'text-blue-500' : processingStatus.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="font-medium">Question Generation</span>
              </div>
            </div>
            <div className={`p-4 rounded-lg border ${processingStatus.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center">
                <Download className={`h-5 w-5 mr-2 ${processingStatus.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
                <span className="font-medium">Export Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Video metadata */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Video Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{formatTime(video.duration)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Filename</p>
              <p className="font-medium">{video.fileName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Question Status</p>
              <p className="font-medium">
                {processingStatus.status === 'completed' 
                  ? `${questions?.length || 0} Questions Generated` 
                  : 'Pending Generation'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transcript and questions */}
      {(isLoadingSegments || segments?.length === 0) && processingStatus.status !== 'completed' ? (
        <div className="bg-white rounded-lg shadow p-6 mb-8 text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transcript Not Available Yet</h3>
          <p className="text-gray-600">
            The transcript is currently being generated. Please check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Segment list */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-medium text-gray-800">Video Segments</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {segments?.map((segment: TranscriptSegment) => (
                <button
                  key={segment._id}
                  onClick={() => setActiveSegmentId(segment._id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${activeSegmentId === segment._id ? 'bg-indigo-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {getQuestionsForSegment(segment._id).length} Q
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {segment.text.substring(0, 100)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Selected segment details and questions */}
          <div className="lg:col-span-2 space-y-6">
            {activeSegmentId && segments && (
              <>
                {/* Transcript */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Transcript</h2>
                    <span className="text-sm text-gray-500">
                      {formatTime(segments.find(s => s._id === activeSegmentId)?.startTime || 0)} - 
                      {formatTime(segments.find(s => s._id === activeSegmentId)?.endTime || 0)}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    <p>{segments.find(s => s._id === activeSegmentId)?.text}</p>
                  </div>
                </div>
                
                {/* Questions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="font-medium text-gray-800">Generated Questions</h2>
                      <span className="text-sm text-gray-500">
                        {getQuestionsForSegment(activeSegmentId).length} questions
                      </span>
                    </div>
                  </div>
                  
                  {isLoadingQuestions ? (
                    <div className="p-6 text-center">Loading questions...</div>
                  ) : getQuestionsForSegment(activeSegmentId).length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      {processingStatus.status === 'completed' 
                        ? 'No questions generated for this segment.' 
                        : 'Questions are being generated. Please wait.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {getQuestionsForSegment(activeSegmentId).map((question: Question, index: number) => (
                        <div key={question._id} className="p-6">
                          <h3 className="font-medium text-gray-900 mb-4">
                            {index + 1}. {question.text}
                          </h3>
                          <div className="space-y-3 ml-4">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={optIndex}
                                className={`p-3 rounded-md ${option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}
                              >
                                <div className="flex items-start">
                                  <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    <span className="text-xs font-medium">
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                  </div>
                                  <span className="ml-2 text-gray-700">{option.text}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetailsPage;