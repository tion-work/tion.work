'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Copy, Download, Settings, RotateCcw, FileText } from 'lucide-react';

interface CSSMinifierProps {
  onResult?: (result: string) => void;
}

export default function CSSMinifier({ onResult }: CSSMinifierProps) {
  const [input, setInput] = useState(`/* 示例 CSS 代码 */
.header {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav a {
  color: #333333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav a:hover {
  background-color: #f0f0f0;
}`);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  const [options, setOptions] = useState({
    removeComments: true,
    removeEmptyRules: true,
    removeEmptySelectors: true,
    removeRedundantProperties: true,
    removeUnusedCSS: false,
    minifySelectors: true,
    minifyValues: true
  });

  const minifyCSS = async (css: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tools/css-minifier/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: css,
          options
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.result);
        onResult?.(result.result);
        
        // 计算压缩统计
        const originalSize = css.length;
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
        minifyCSS(input);
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
    const blob = new Blob([output], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput(`/* 示例 CSS 代码 */
.header {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav a {
  color: #333333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav a:hover {
  background-color: #f0f0f0;
}`);
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
              id="removeEmptyRules"
              checked={options.removeEmptyRules}
              onChange={(e) => setOptions({ ...options, removeEmptyRules: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeEmptyRules" className="text-sm font-medium">移除空规则</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeEmptySelectors"
              checked={options.removeEmptySelectors}
              onChange={(e) => setOptions({ ...options, removeEmptySelectors: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeEmptySelectors" className="text-sm font-medium">移除空选择器</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="removeRedundantProperties"
              checked={options.removeRedundantProperties}
              onChange={(e) => setOptions({ ...options, removeRedundantProperties: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="removeRedundantProperties" className="text-sm font-medium">移除冗余属性</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="minifySelectors"
              checked={options.minifySelectors}
              onChange={(e) => setOptions({ ...options, minifySelectors: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="minifySelectors" className="text-sm font-medium">压缩选择器</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="minifyValues"
              checked={options.minifyValues}
              onChange={(e) => setOptions({ ...options, minifyValues: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="minifyValues" className="text-sm font-medium">压缩值</label>
          </div>
        </div>
      </Card>

      {/* 输入输出区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">CSS 代码</h3>
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
            language="css"
            value={input}
            onChange={setInput}
            height="400px"
            placeholder="输入 CSS 代码..."
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
            language="css"
            value={output}
            onChange={() => {}}
            readOnly
            height="400px"
            placeholder="压缩后的 CSS 将显示在这里..."
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
          <li>• 移除注释和空白字符</li>
          <li>• 优化 CSS 选择器和属性</li>
          <li>• 合并相同的 CSS 规则</li>
          <li>• 支持 CSS3 和现代语法</li>
          <li>• 保持 CSS 功能完整性</li>
        </ul>
      </Card>
    </div>
  );
}
