import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, FileText, HelpCircle, Upload } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Turn Lecture Videos into Interactive Quizzes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Upload your lecture videos, get automatic transcriptions, and generate MCQ questions for every 5-minute segment.
        </p>
        <div className="mt-8">
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Step 1 */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-500">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mx-auto mb-4">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Upload Video
          </h3>
          <p className="text-gray-600 text-center">
            Upload your lecture video in MP4 format. Our system accepts videos up to 100MB in size.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-teal-500">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mx-auto mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Automatic Transcription
          </h3>
          <p className="text-gray-600 text-center">
            Our system transcribes your video and breaks the content into 5-minute segments for easy navigation.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mx-auto mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Generate Questions
          </h3>
          <p className="text-gray-600 text-center">
            AI automatically creates multiple-choice questions for each segment, helping reinforce learning.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-8 border border-indigo-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Why Use LectureQuiz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-600">
                1
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Save Time Creating Assessments
              </h3>
              <p className="mt-1 text-gray-600">
                Automatically generate quiz questions from your lecture content instead of manual creation.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-600">
                2
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Enhance Student Learning
              </h3>
              <p className="mt-1 text-gray-600">
                Provide students with interactive quizzes to reinforce key concepts from lectures.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-600">
                3
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Privacy-Focused
              </h3>
              <p className="mt-1 text-gray-600">
                All processing happens locally on your machine with no data sent to external servers.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-600">
                4
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Easy to Use
              </h3>
              <p className="mt-1 text-gray-600">
                Simple interface with no technical knowledge required. Just upload and go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;