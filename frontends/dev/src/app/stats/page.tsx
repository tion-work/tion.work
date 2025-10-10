'use client';

import React from 'react';
import { UsageStats } from '@/components/ui/UsageStats';

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            使用统计
          </h1>
          <p className="text-lg text-gray-600">
            了解工具的使用情况和性能指标
          </p>
        </div>
        
        <UsageStats />
      </div>
    </div>
  );
}
