'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'tool' | 'category' | 'feature';
}

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBox({ 
  onSearch, 
  onResultSelect, 
  placeholder = "搜索工具...",
  className = ""
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularTools, setPopularTools] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 模拟搜索结果
  const mockResults: SearchResult[] = [
    {
      id: 'json-formatter',
      title: 'JSON 格式化器',
      description: '美化和格式化 JSON 数据',
      category: 'code',
      type: 'tool'
    },
    {
      id: 'javascript-formatter',
      title: 'JavaScript 格式化器',
      description: '美化和格式化 JavaScript 代码',
      category: 'code',
      type: 'tool'
    },
    {
      id: 'css-minifier',
      title: 'CSS 压缩器',
      description: '压缩 CSS 代码，减少文件大小',
      category: 'code',
      type: 'tool'
    },
    {
      id: 'base64-encoder',
      title: 'Base64 编码器',
      description: 'Base64 编码和解码工具',
      category: 'data',
      type: 'tool'
    },
    {
      id: 'password-generator',
      title: '密码生成器',
      description: '生成安全的随机密码',
      category: 'security',
      type: 'tool'
    },
    {
      id: 'qr-code-generator',
      title: '二维码生成器',
      description: '生成二维码图片',
      category: 'utility',
      type: 'tool'
    },
    {
      id: 'markdown-converter',
      title: 'Markdown 转换器',
      description: '将 Markdown 转换为 HTML',
      category: 'text',
      type: 'tool'
    }
  ];

  // 模拟热门工具
  const mockPopularTools: SearchResult[] = [
    {
      id: 'json-formatter',
      title: 'JSON 格式化器',
      description: '最受欢迎的工具',
      category: 'code',
      type: 'tool'
    },
    {
      id: 'base64-encoder',
      title: 'Base64 编码器',
      description: '数据处理必备',
      category: 'data',
      type: 'tool'
    },
    {
      id: 'password-generator',
      title: '密码生成器',
      description: '安全开发工具',
      category: 'security',
      type: 'tool'
    }
  ];

  useEffect(() => {
    // 加载最近搜索记录
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // 模拟搜索延迟
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }, 300);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    setQuery('');
    setIsOpen(false);
    
    // 保存到最近搜索
    const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // 延迟关闭，让点击事件能够触发
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          {query ? (
            // 搜索结果
            <div className="p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    搜索结果 ({results.length})
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-start space-x-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.description}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          {result.category}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-4 text-center text-gray-500">
                  没有找到相关工具
                </div>
              )}
            </div>
          ) : (
            // 默认显示：最近搜索和热门工具
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    最近搜索
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm text-gray-700"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  热门工具
                </div>
                <div className="space-y-1">
                  {mockPopularTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleResultClick(tool)}
                      className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 flex items-start space-x-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {tool.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tool.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
