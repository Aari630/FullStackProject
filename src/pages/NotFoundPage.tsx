import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-indigo-100">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-3">Page Not Found</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;