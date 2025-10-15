"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ToolRegistry } from "@/lib/tools/registry";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "tool" | "category" | "feature";
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
  className = "",
}: SearchBoxProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularTools, setPopularTools] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 获取所有工具并转换为搜索结果格式
  const getAllTools = (): SearchResult[] => {
    return ToolRegistry.getAll().map((tool) => {
      const localizedContent = tool.getLocalizedContent(language || "zh");
      return {
        id: tool.id,
        title: localizedContent.name,
        description: localizedContent.description,
        category: tool.category,
        type: "tool" as const,
      };
    });
  };

  // 获取热门工具（使用前6个工具作为示例）
  const getPopularTools = (): SearchResult[] => {
    return ToolRegistry.getAll()
      .slice(0, 6)
      .map((tool) => {
        const localizedContent = tool.getLocalizedContent(language || "zh");
        return {
          id: tool.id,
          title: localizedContent.name,
          description: localizedContent.description,
          category: tool.category,
          type: "tool" as const,
        };
      });
  };

  useEffect(() => {
    // 加载当前语言的最近搜索记录
    const saved = localStorage.getItem(`recentSearches_${language}`);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    } else {
      setRecentSearches([]);
    }

    // 设置热门工具
    setPopularTools(getPopularTools());
  }, [language]);

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
      const allTools = getAllTools();
      const filtered = allTools.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
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

  const handleSearchSubmit = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // 保存搜索查询到最近搜索
    const newRecent = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem(
      `recentSearches_${language}`,
      JSON.stringify(newRecent)
    );

    // 执行搜索
    onSearch(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result);
    setQuery("");
    setIsOpen(false);

    // 保存到当前语言的最近搜索
    const newRecent = [
      result.title,
      ...recentSearches.filter((s) => s !== result.title),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem(
      `recentSearches_${language}`,
      JSON.stringify(newRecent)
    );
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(query);
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
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {query ? (
            // 搜索结果
            <div className="p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {language === "en"
                      ? `Search Results (${results.length})`
                      : language === "ja"
                      ? `検索結果 (${results.length})`
                      : `搜索结果 (${results.length})`}
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {result.description}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {language === "en"
                    ? "No tools found"
                    : language === "ja"
                    ? "ツールが見つかりません"
                    : "没有找到相关工具"}
                </div>
              )}
            </div>
          ) : (
            // 默认状态：最近搜索和热门工具
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {language === "en"
                      ? "Recent Searches"
                      : language === "ja"
                      ? "最近の検索"
                      : "最近搜索"}
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleInputChange(search)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-sm text-gray-700"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {language === "en"
                    ? "Popular Tools"
                    : language === "ja"
                    ? "人気ツール"
                    : "热门工具"}
                </div>
                <div className="space-y-1">
                  {popularTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleResultClick(tool)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {tool.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {tool.description}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
