'use client';

import React from 'react';
import CSSMinifier from '@/components/tools/CSSMinifier';

export default function CSSMinifierPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CSS 压缩器</h1>
          <p className="text-lg text-gray-600">
            压缩 CSS 代码，移除空白字符和注释，减少文件大小
          </p>
        </div>
        
        <CSSMinifier />
      </div>
    </div>
  );
}
