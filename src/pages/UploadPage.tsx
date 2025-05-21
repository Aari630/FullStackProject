import React from 'react';
import VideoUploader from '../components/VideoUploader';

const UploadPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Video</h1>
      <VideoUploader />
    </div>
  );
};

export default UploadPage;