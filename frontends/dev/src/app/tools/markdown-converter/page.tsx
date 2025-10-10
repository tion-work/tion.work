'use client';

import React from 'react';
import MarkdownConverter from '@/components/tools/MarkdownConverter';

export default function MarkdownConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Markdown 转换器</h1>
          <p className="text-lg text-gray-600">
            将 Markdown 代码转换为 HTML，支持 GitHub 风格扩展和数学公式
          </p>
        </div>
        
        <MarkdownConverter />
      </div>
    </div>
  );
}
