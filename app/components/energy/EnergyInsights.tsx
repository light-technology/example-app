import React from 'react';

const EnergyInsights: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Energy Insights
      </h2>
      <div className="text-gray-500 text-center py-8">
        <div className="text-6xl mb-4">⚡</div>
        <p className="text-lg mb-2">Real-time energy data coming soon</p>
        <p className="text-sm">
          Once enrolled, you'll see detailed usage patterns and personalized
          insights here.
        </p>
      </div>
    </div>
  );
};

export default EnergyInsights;
