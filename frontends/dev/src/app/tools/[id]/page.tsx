'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CodeEditor } from '@/components/ui/CodeEditor';
import Loading from '@/components/ui/Loading';
import { ToolRegistry } from '@/lib/tools';
import { BaseTool } from '@/lib/tools/base';
import { useAddToHistory } from '@/stores/useAppStore';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils';

export default function ToolPage() {
  const params = useParams();
  const addToHistory = useAddToHistory();
  const [tool, setTool] = useState<BaseTool | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const toolInstance = ToolRegistry.get(params.id as string);
      if (toolInstance) {
        setTool(toolInstance);
        // 初始化选项默认值
        const defaultOptions: Record<string, any> = {};
        toolInstance.options.forEach(option => {
          defaultOptions[option.key] = option.defaultValue;
        });
        setOptions(defaultOptions);
      }
    }
  }, [params.id]);

  const handleProcess = async () => {
    if (!tool || !input.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await tool.process(input, options);
      setOutput(result);
      
      // 添加到历史记录
      addToHistory({
        toolId: tool.id,
        input,
        output: result,
        options: { ...options },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
      // 可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleDownload = (text: string, filename: string) => {
    downloadFile(text, filename);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900  mb-4">
            工具未找到
          </h1>
          <p className="text-secondary-600 
            请检查工具 ID 是否正确
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white 
      {/* Header - 极简设计 */}
      <div className="border-b border-gray-200  bg-white  sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100  flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600 
                {tool.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900"
                {tool.name}
              </h1>
              <p className="text-gray-600"
                {tool.description}
              </p>
            </div>
          </div>
          
          {/* 快速操作 */}
          <div className="flex gap-2">
            <Button
              onClick={handleProcess}
              disabled={loading || !input.trim()}
              size="sm"
              className="px-4 py-2"
            >
              {loading ? '处理中...' : '处理'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              size="sm"
              className="px-4 py-2"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            {output && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(output)}
                  className="px-4 py-2"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  复制
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(output, `${tool.id}-output.txt`)}
                  className="px-4 py-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900  mb-4">
                输入内容
              </h2>
              <div className="space-y-4">
                <CodeEditor
                  language="text"
                  value={input}
                  onChange={setInput}
                  placeholder="请输入要处理的内容..."
                  height="400px"
                />
                
                {/* 选项 */}
                {tool.options.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900"
                      选项设置
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {tool.options.map(option => (
                        <div key={option.key}>
                          <label className="block text-sm font-medium text-gray-700  mb-1">
                            {option.label}
                          </label>
                          {option.type === 'boolean' ? (
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={options[option.key] || false}
                                onChange={(e) => setOptions(prev => ({
                                  ...prev,
                                  [option.key]: e.target.checked
                                }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-600"
                                {option.description}
                              </span>
                            </label>
                          ) : option.type === 'select' ? (
                            <select
                              value={options[option.key] || option.defaultValue}
                              onChange={(e) => setOptions(prev => ({
                                ...prev,
                                [option.key]: e.target.value
                              }))}
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500   
                            >
                              {option.options?.map((opt: { label: string; value: any }) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={option.type}
                              value={options[option.key] || option.defaultValue}
                              onChange={(e) => setOptions(prev => ({
                                ...prev,
                                [option.key]: option.type === 'number' ? parseInt(e.target.value) : e.target.value
                              }))}
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500   
                              placeholder={option.description}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 输出区域 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900  mb-4">
                处理结果
              </h2>
              <div className="space-y-4">
                {error ? (
                  <div className="rounded-md bg-red-50  p-4">
                    <p className="text-sm text-red-800 
                  </div>
                ) : (
                  <CodeEditor
                    language="text"
                    value={output}
                    onChange={setOutput}
                    placeholder="处理结果将显示在这里..."
                    height="400px"
                    readOnly
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
