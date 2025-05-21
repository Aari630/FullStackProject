import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadVideo } from '../lib/api';
import { formatFileSize } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const VideoUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    // Validate file type
    if (!selectedFile.type.includes('video/mp4')) {
      toast.error('Only MP4 video files are supported');
      return;
    }
    
    // Validate file size (100MB limit)
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error('File size exceeds 100MB limit');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', file.name.replace('.mp4', ''));

      // Create an XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Setup progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          toast.success('Video uploaded successfully!');
          navigate(`/videos/${response._id}`);
        } else {
          throw new Error('Upload failed');
        }
      });
      
      xhr.addEventListener('error', () => {
        throw new Error('Network error');
      });
      
      xhr.open('POST', 'http://localhost:3001/api/videos/upload');
      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Lecture Video</h2>
        <p className="text-gray-600">Upload an MP4 lecture video (max 100MB) to generate a transcript and MCQ questions.</p>
      </div>
      
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-indigo-400 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`
          }
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-indigo-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-1">
              {isDragActive ? 'Drop your video here' : 'Drag and drop your video file'}
            </p>
            <p className="text-gray-500 mb-4">or click to browse files</p>
            <p className="text-sm text-gray-400">MP4 format only, max 100MB</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium text-gray-800">{file.name}</span>
            </div>
            {!uploading && (
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">
              File size: {formatFileSize(file.size)}
            </p>
          </div>
          
          {uploading && (
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 text-right">{uploadProgress}%</p>
            </div>
          )}
          
          <div className="flex justify-end">
            {!uploading ? (
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Upload Video
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
              >
                Uploading...
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Processing Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>After uploading, the video will be automatically transcribed</li>
                <li>Questions will be generated for every 5-minute segment</li>
                <li>The entire process may take several minutes depending on the video length</li>
                <li>You'll be redirected to view progress once the upload is complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;