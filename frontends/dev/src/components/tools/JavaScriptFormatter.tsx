'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Copy, Download, Settings, RotateCcw } from 'lucide-react';

interface JavaScriptFormatterProps {
  onResult?: (result: string) => void;
}

export default function JavaScriptFormatter({ onResult }: JavaScriptFormatterProps) {
  const [input, setInput] = useState(`function example() {
  const data = {name: "John", age: 30, city: "New York"};
  console.log("Hello World");
  return data;
}`);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    indentSize: 2,
    indentType: 'space' as 'space' | 'tab',
    maxLineLength: 80,
    preserveComments: true,
    compact: false
  });

  const formatJavaScript = async (code: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tools/javascript-formatter/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: code,
          options
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.result);
        onResult?.(result.result);
      } else {
        setError(result.error || '格式化失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (input.trim()) {
      const timeoutId = setTimeout(() => {
        formatJavaScript(input);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setOutput('');
    }
  }, [input, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput(`function example() {
  const data = {name: "John", age: 30, city: "New York"};
  console.log("Hello World");
  return data;
}`);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* 选项设置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-semibold">格式化选项</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">缩进大小</label>
            <select
              value={options.indentSize}
              onChange={(e) => setOptions({ ...options, indentSize: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value={8}>8 空格</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">缩进类型</label>
            <select
              value={options.indentType}
              onChange={(e) => setOptions({ ...options, indentType: e.target.value as 'space' | 'tab' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="space">空格</option>
              <option value="tab">制表符</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">最大行长度</label>
            <input
              type="number"
              value={options.maxLineLength}
              onChange={(e) => setOptions({ ...options, maxLineLength: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="40"
              max="200"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="compact"
              checked={options.compact}
              onChange={(e) => setOptions({ ...options, compact: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="compact" className="text-sm font-medium">压缩模式</label>
          </div>
        </div>
      </Card>

      {/* 输入区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">JavaScript 代码</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>
          <CodeEditor
            language="javascript"
            value={input}
            onChange={setInput}
            height="400px"
            placeholder="输入 JavaScript 代码..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">格式化结果</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                复制
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!output}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                下载
              </Button>
            </div>
          </div>
          <CodeEditor
            language="javascript"
            value={output}
            onChange={() => {}}
            readOnly
            height="400px"
            placeholder="格式化后的代码将显示在这里..."
          />
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="text-red-600">
            <strong>错误：</strong> {error}
          </div>
        </Card>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">正在格式化...</span>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="p-4 bg-blue-50">
        <h4 className="font-semibold mb-2">使用说明</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 支持 ES5、ES6+ 语法格式化</li>
          <li>• 自动修复常见的语法问题</li>
          <li>• 支持自定义缩进和行长度</li>
          <li>• 保留注释和字符串格式</li>
          <li>• 实时预览格式化结果</li>
        </ul>
      </Card>
    </div>
  );
}
