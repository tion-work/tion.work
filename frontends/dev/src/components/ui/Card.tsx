import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types';

export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  className,
  hover = false,
  ...props
}) => {
  const cardClasses = cn(
    'rounded-lg border border-secondary-200 bg-white shadow-sm',
    hover && 'transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {(title || description) && (
        <div className="p-6 pb-0">
          {title && (
            <h3 className="text-lg font-semibold text-secondary-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-secondary-600">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn('p-6', !title && !description && 'p-6')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
