import React from 'react';
import { UpcomingService } from '../../types/dashboard';

const UpcomingServices: React.FC = () => {
  const upcomingServices: UpcomingService[] = [
    {
      date: '••••',
      service: '••••••',
      type: '••••••••',
      time: '••••',
    },
    {
      date: '••••',
      service: '••••••',
      type: '••••••••',
      time: '••••',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 opacity-85 pointer-events-none">
      <h2 className="text-lg font-medium text-gray-400 mb-4">
        Upcoming Services
      </h2>
      <div className="space-y-3">
        {upcomingServices.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            <div>
              <div className="font-medium text-gray-300">{service.service}</div>
              <div className="text-sm text-gray-300">{service.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-300">
                {service.date}
              </div>
              <div className="text-sm text-gray-300">{service.time}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-4 border-2 border-gray-300 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
        disabled
      >
        Schedule New Service
      </button>
    </div>
  );
};

export default UpcomingServices;
