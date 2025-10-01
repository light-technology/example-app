import React from 'react';

const EnergyLoadingCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg border-2 border-gray-200 p-8 animate-pulse">
      <div className="flex items-center mb-5">
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-4"></div>
        <div className="h-6 bg-gray-300 rounded w-48"></div>
      </div>
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-56"></div>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-200 rounded w-60"></div>
          </div>
        </div>
      </div>
      <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
    </div>
  );
};

export default EnergyLoadingCard;
