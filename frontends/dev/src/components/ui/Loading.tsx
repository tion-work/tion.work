import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingProps } from '@/types';

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Loading...',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-secondary-300 border-t-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-secondary-600 
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
