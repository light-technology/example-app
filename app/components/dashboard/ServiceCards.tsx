import React from 'react';
import { Service } from '../../types/dashboard';

const ServiceCards: React.FC = () => {
  const services: Service[] = [
    {
      name: 'Service A',
      status: '',
      lastService: '••••',
      nextService: '••••',
      efficiency: '••',
    },
  ];

  const additionalServices: Service[] = [
    {
      name: 'Service B',
      status: '',
      lastService: '••••',
      nextService: '••••',
      efficiency: '••',
    },
    {
      name: 'Service C',
      status: '',
      lastService: '••••',
      nextService: '••••',
      efficiency: '••',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-90">
      {services.map((service, index) => (
        <div
          key={index}
          className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-300 p-4 pointer-events-none"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-400">{service.name}</h3>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Efficiency: {service.efficiency}%</div>
            <div>Last Service: {service.lastService}</div>
            <div>Next Service: {service.nextService}</div>
          </div>
        </div>
      ))}
      {additionalServices.map((service, index) => (
        <div
          key={`additional-${index}`}
          className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-300 p-4 pointer-events-none"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-400">{service.name}</h3>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <div>Efficiency: {service.efficiency}%</div>
            <div>Last Service: {service.lastService}</div>
            <div>Next Service: {service.nextService}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;
