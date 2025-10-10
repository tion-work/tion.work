'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Copy, Download, Settings, RotateCcw, FileText } from 'lucide-react';

interface HTMLMinifierProps {
  onResult?: (result: string) => void;
}

export default function HTMLMinifier({ onResult }: HTMLMinifierProps) {
  const [input, setInput] = useState(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用 HTML 压缩器</h1>
        <p>这是一个示例 HTML 页面，用于演示压缩功能。</p>
        <ul>
            <li>移除空白字符</li>
            <li>压缩内联样式</li>
            <li>优化标签结构</li>
        </ul>
    </div>
</body>
</html>`);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  const [options, setOptions] = useState({
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: false,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  });

  const minifyHTML = async (html: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tools/html-minifier/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: html,
          options
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.result);
        onResult?.(result.result);
        
        // 计算压缩统计
        const originalSize = html.length;
        const minifiedSize = result.result.length;
        const compressionRatio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize * 100) : 0;
        
        setStats({
          originalSize,
          minifiedSize,
          compressionRatio: Math.round(compressionRatio * 100) / 100
        });
      } else {
        setError(result.error || '压缩失败');
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
        minifyHTML(input);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setOutput('');
      setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
    }
  }, [input, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎使用 HTML 压缩器</h1>
        <p>这是一个示例 HTML 页面，用于演示压缩功能。</p>
        <ul>
            <li>移除空白字符</li>
            <li>压缩内联样式</li>
            <li>优化标签结构</li>
        </ul>
    </div>
</body>
</html>`);
    setOutput('');
    setError('');
    setStats({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  };

  return (
    <div className="space-y-6">
      {/* 压缩统计 */}
      {stats.originalSize > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">压缩统计</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">原始大小：</span>
              <span className="font-mono font-semibold">{stats.originalSize} 字符</span>
            </div>
            <div>
              <span className="text-gray-600">压缩后：</span>
              <span className="font-mono font-semibold">{stats.minifiedSize} 字符</span>
            </div>
            <div>
              <span className="text-gray-600">压缩率：</span>
              <span className="font-mono font-semibold text-green-600">{stats.compressionRatio}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* 选项设置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-semibold">压缩选项</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeComments"
              checked={options.removeComments}
              onChange={(e) => setOptions({ ...options, removeComments: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeComments" className="text-sm font-medium">移除注释</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeEmptyAttributes"
              checked={options.removeEmptyAttributes}
              onChange={(e) => setOptions({ ...options, removeEmptyAttributes: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeEmptyAttributes" className="text-sm font-medium">移除空属性</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeEmptyElements"
              checked={options.removeEmptyElements}
              onChange={(e) => setOptions({ ...options, removeEmptyElements: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeEmptyElements" className="text-sm font-medium">移除空元素</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeOptionalTags"
              checked={options.removeOptionalTags}
              onChange={(e) => setOptions({ ...options, removeOptionalTags: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeOptionalTags" className="text-sm font-medium">移除可选标签</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeRedundantAttributes"
              checked={options.removeRedundantAttributes}
              onChange={(e) => setOptions({ ...options, removeRedundantAttributes: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeRedundantAttributes" className="text-sm font-medium">移除冗余属性</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="collapseWhitespace"
              checked={options.collapseWhitespace}
              onChange={(e) => setOptions({ ...options, collapseWhitespace: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="collapseWhitespace" className="text-sm font-medium">压缩空白</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="minifyCSS"
              checked={options.minifyCSS}
              onChange={(e) => setOptions({ ...options, minifyCSS: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="minifyCSS" className="text-sm font-medium">压缩内联 CSS</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="minifyJS"
              checked={options.minifyJS}
              onChange={(e) => setOptions({ ...options, minifyJS: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="minifyJS" className="text-sm font-medium">压缩内联 JS</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeScriptTypeAttributes"
              checked={options.removeScriptTypeAttributes}
              onChange={(e) => setOptions({ ...options, removeScriptTypeAttributes: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeScriptTypeAttributes" className="text-sm font-medium">移除 script type</label>
          </div>
        </div>
      </Card>

      {/* 输入输出区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">HTML 代码</h3>
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
            language="html"
            value={input}
            onChange={setInput}
            height="400px"
            placeholder="输入 HTML 代码..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">压缩结果</h3>
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
            language="html"
            value={output}
            onChange={() => {}}
            readOnly
            height="400px"
            placeholder="压缩后的 HTML 将显示在这里..."
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
          <span className="ml-2 text-gray-600">正在压缩...</span>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="p-4 bg-blue-50">
        <h4 className="font-semibold mb-2">使用说明</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 移除 HTML 注释和空白字符</li>
          <li>• 压缩内联 CSS 和 JavaScript</li>
          <li>• 优化 HTML 标签结构</li>
          <li>• 移除冗余属性和标签</li>
          <li>• 保持 HTML 功能完整性</li>
        </ul>
      </Card>
    </div>
  );
}
