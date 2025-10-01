import React from 'react';

interface EnergyEnrollmentCardProps {
  onEnrollClick: () => void;
  enrollLoading: boolean;
}

const EnergyEnrollmentCard: React.FC<EnergyEnrollmentCardProps> = ({
  onEnrollClick,
  enrollLoading,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg border-2 border-blue-300 p-8 transform hover:scale-[1.02] transition-all duration-200 relative z-10">
      <div className="flex items-center mb-5">
        <div className="text-3xl mr-4">⚡</div>
        <h2 className="text-xl font-bold text-gray-900">
          [EXAMPLE] Energy Plan
        </h2>
      </div>
      <div className="mb-6">
        <p className="text-gray-800 mb-4 text-base font-medium">
          Take control of your energy costs with our integrated electricity plan
          designed exclusively for our customers.
        </p>
        <div className="space-y-3 text-base">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">
              Exclusive rates negotiated for our members
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">
              Simple, transparent billing integrated into your account
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">
              24/7 usage tracking and insights
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={onEnrollClick}
        disabled={enrollLoading}
        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01]"
      >
        {enrollLoading ? 'Loading...' : 'Enroll Now'}
      </button>
    </div>
  );
};

export default EnergyEnrollmentCard;
