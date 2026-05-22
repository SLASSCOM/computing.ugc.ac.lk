import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full shimmer" />
        <div className="mx-auto mb-2 h-4 w-40 rounded shimmer" />
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
