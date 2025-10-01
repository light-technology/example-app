'use client';

import React from 'react';

interface ErrorDisplayProps {
  message: string;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  className = '',
}) => {
  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}
    >
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
