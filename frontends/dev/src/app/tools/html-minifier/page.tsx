'use client';

import React from 'react';
import HTMLMinifier from '@/components/tools/HTMLMinifier';

export default function HTMLMinifierPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML 压缩器</h1>
          <p className="text-lg text-gray-600">
            压缩 HTML 代码，移除空白字符、注释和冗余属性，优化页面加载速度
          </p>
        </div>
        
        <HTMLMinifier />
      </div>
    </div>
  );
}
