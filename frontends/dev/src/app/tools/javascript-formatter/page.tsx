'use client';

import React from 'react';
import JavaScriptFormatter from '@/components/tools/JavaScriptFormatter';
import { Metadata } from 'next';

export default function JavaScriptFormatterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JavaScript 格式化器</h1>
          <p className="text-lg text-gray-600">
            美化和格式化 JavaScript 代码，支持自定义缩进、行长度等选项
          </p>
        </div>
        
        <JavaScriptFormatter />
      </div>
    </div>
  );
}
