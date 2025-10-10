import React from 'react';
import { cn } from '@/lib/utils';
import { TextareaProps } from '@/types';

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error,
  label,
  className,
  ...props
}) => {
  const textareaClasses = cn(
    'flex min-h-[80px] w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50    
    error && 'border-red-500 focus:ring-red-500',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-secondary-700 
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 
      )}
    </div>
  );
};

export default Textarea;
