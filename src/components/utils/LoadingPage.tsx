import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"></div>
          <div className="animate-pulse ml-4 h-5 w-5 bg-purple-600 rounded-full"></div>
          <div className="animate-pulse ml-4 h-5 w-5 bg-purple-600 rounded-full"></div>
          <div className="animate-pulse ml-4 h-5 w-5 bg-purple-600 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-500">Chargement...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
