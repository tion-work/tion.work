'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SearchBox } from '@/components/ui/SearchBox';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  const handleSearch = (query: string) => {
    // 处理搜索逻辑
    console.log('Search query:', query);
  };

  const handleResultSelect = (result: any) => {
    // 处理搜索结果选择
    window.location.href = `/tools/${result.id}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - 极简设计 */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              TiON
            </span>
          </Link>

          {/* 搜索框 - 居中显示 */}
          <div className="flex-1 max-w-md mx-4">
            <SearchBox
              onSearch={handleSearch}
              onResultSelect={handleResultSelect}
              placeholder="搜索工具..."
              className="w-full"
            />
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-3 flex-shrink-0">
                   {/* 导航 - 桌面端显示 */}
                   <nav className="hidden lg:flex items-center space-x-6">
                     <Link
                       href="/stats"
                       className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                     >
                       统计
                     </Link>
                     <Link
                       href="/about"
                       className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                     >
                       关于
                     </Link>
                   </nav>


            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
