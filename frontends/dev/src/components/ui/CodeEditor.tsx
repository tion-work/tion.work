'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CodeEditorProps } from '@/types';

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  height = '300px',
  options = {},
  ...props
}) => {
  const [MonacoEditor, setMonacoEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMonaco = async () => {
      if (typeof window !== 'undefined') {
        try {
          const monaco = await import('@monaco-editor/react');
          setMonacoEditor(() => monaco.default);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to load Monaco Editor:', error);
          setIsLoading(false);
        }
      }
    };

    loadMonaco();
  }, []);

  const defaultOptions = {
    theme: 'vs-dark',
    language,
    value,
    onChange: (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    options: {
      readOnly,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      automaticLayout: true,
      ...options,
    },
    height,
    ...props,
  };

  if (typeof window === 'undefined' || isLoading) {
    // Server-side rendering fallback or loading state
    return (
      <div
        className={cn(
          'flex min-h-[300px] w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-4 font-mono text-sm  
          readOnly && 'bg-gray-100 
        )}
        style={{ height }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span>Loading editor...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">
            {value || placeholder}
          </pre>
        )}
      </div>
    );
  }

  // Client-side Monaco Editor
  if (MonacoEditor) {
    return (
      <div className="w-full rounded-md border border-gray-300 overflow-hidden 
        <MonacoEditor {...defaultOptions} />
      </div>
    );
  }

  // Fallback for when Monaco fails to load
  return (
    <div
      className={cn(
        'min-h-[300px] w-full rounded-md border border-gray-300 bg-gray-50 p-4 font-mono text-sm  
        readOnly && 'bg-gray-100 
      )}
      style={{ height }}
    >
      <pre className="whitespace-pre-wrap">
        {value || placeholder}
      </pre>
    </div>
  );
};

export default CodeEditor;
