import React, { memo } from 'react';

interface LoadingSpinnerProps {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400"></div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export const PageLoader: React.FC = memo(() => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-zinc-400">Loading legal documents...</p>
    </div>
  </div>
));

PageLoader.displayName = 'PageLoader';