'use client';

import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <p className="text-gray-500 mb-2">{title}</p>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
        {action}
      </div>
    </div>
  );
};

export default EmptyState;
