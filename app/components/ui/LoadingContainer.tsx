'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingContainerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({
  size = 'lg',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <LoadingSpinner size={size} />
    </div>
  );
};

export default LoadingContainer;
