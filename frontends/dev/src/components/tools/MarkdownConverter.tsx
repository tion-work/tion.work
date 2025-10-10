'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Copy, Download, Settings, RotateCcw, Eye, Code } from 'lucide-react';

interface MarkdownConverterProps {
  onResult?: (result: string) => void;
}

export default function MarkdownConverter({ onResult }: MarkdownConverterProps) {
  const [input, setInput] = useState(`# Markdown 转换器

这是一个 **Markdown** 转换器示例。

## 功能特性

- 支持标题、列表、链接等基本语法
- 支持代码高亮
- 支持表格
- 支持数学公式

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 表格示例

| 功能 | 支持 | 说明 |
|------|------|------|
| 标题 | ✅ | 支持 1-6 级标题 |
| 列表 | ✅ | 支持有序和无序列表 |
| 链接 | ✅ | 支持内联和引用链接 |
| 图片 | ✅ | 支持图片插入 |

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

> 这是一个引用块，用于突出重要信息。

---

**注意**：此工具支持标准的 Markdown 语法。`);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'html' | 'preview'>('html');
  const [options, setOptions] = useState({
    enableGfm: true, // GitHub Flavored Markdown
    enableTables: true,
    enableStrikethrough: true,
    enableTaskLists: true,
    enableFootnotes: true,
    enableMath: true,
    enableCodeHighlight: true,
    sanitize: false,
    breaks: false
  });

  const convertMarkdown = async (markdown: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tools/markdown-converter/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: markdown,
          options
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.result);
        onResult?.(result.result);
      } else {
        setError(result.error || '转换失败');
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
        convertMarkdown(input);
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
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput(`# Markdown 转换器

这是一个 **Markdown** 转换器示例。

## 功能特性

- 支持标题、列表、链接等基本语法
- 支持代码高亮
- 支持表格
- 支持数学公式

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 表格示例

| 功能 | 支持 | 说明 |
|------|------|------|
| 标题 | ✅ | 支持 1-6 级标题 |
| 列表 | ✅ | 支持有序和无序列表 |
| 链接 | ✅ | 支持内联和引用链接 |
| 图片 | ✅ | 支持图片插入 |

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

> 这是一个引用块，用于突出重要信息。

---

**注意**：此工具支持标准的 Markdown 语法。`);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* 选项设置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-semibold">转换选项</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableGfm"
              checked={options.enableGfm}
              onChange={(e) => setOptions({ ...options, enableGfm: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableGfm" className="text-sm font-medium">GitHub 风格</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableTables"
              checked={options.enableTables}
              onChange={(e) => setOptions({ ...options, enableTables: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableTables" className="text-sm font-medium">表格支持</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableStrikethrough"
              checked={options.enableStrikethrough}
              onChange={(e) => setOptions({ ...options, enableStrikethrough: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableStrikethrough" className="text-sm font-medium">删除线</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableTaskLists"
              checked={options.enableTaskLists}
              onChange={(e) => setOptions({ ...options, enableTaskLists: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableTaskLists" className="text-sm font-medium">任务列表</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableFootnotes"
              checked={options.enableFootnotes}
              onChange={(e) => setOptions({ ...options, enableFootnotes: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableFootnotes" className="text-sm font-medium">脚注</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableMath"
              checked={options.enableMath}
              onChange={(e) => setOptions({ ...options, enableMath: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableMath" className="text-sm font-medium">数学公式</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableCodeHighlight"
              checked={options.enableCodeHighlight}
              onChange={(e) => setOptions({ ...options, enableCodeHighlight: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enableCodeHighlight" className="text-sm font-medium">代码高亮</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sanitize"
              checked={options.sanitize}
              onChange={(e) => setOptions({ ...options, sanitize: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="sanitize" className="text-sm font-medium">HTML 清理</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="breaks"
              checked={options.breaks}
              onChange={(e) => setOptions({ ...options, breaks: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="breaks" className="text-sm font-medium">换行转换</label>
          </div>
        </div>
      </Card>

      {/* 输入输出区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Markdown 代码</h3>
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
            language="markdown"
            value={input}
            onChange={setInput}
            height="400px"
            placeholder="输入 Markdown 代码..."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">转换结果</h3>
            <div className="flex gap-2">
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('html')}
                  className={`px-3 py-1 text-sm flex items-center gap-1 ${
                    viewMode === 'html' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                >
                  <Code className="h-4 w-4" />
                  HTML
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-sm flex items-center gap-1 border-l border-gray-300 ${
                    viewMode === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  预览
                </button>
              </div>
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
          {viewMode === 'html' ? (
            <CodeEditor
              language="html"
              value={output}
              onChange={() => {}}
              readOnly
              height="400px"
              placeholder="转换后的 HTML 将显示在这里..."
            />
          ) : (
            <div
              className="border border-gray-300 rounded-md p-4 h-96 overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          )}
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
          <span className="ml-2 text-gray-600">正在转换...</span>
        </div>
      )}

      {/* 使用说明 */}
      <Card className="p-4 bg-blue-50">
        <h4 className="font-semibold mb-2">使用说明</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 支持标准 Markdown 语法</li>
          <li>• 支持 GitHub 风格扩展</li>
          <li>• 支持数学公式和代码高亮</li>
          <li>• 支持表格、任务列表等高级功能</li>
          <li>• 可切换 HTML 源码和预览模式</li>
        </ul>
      </Card>
    </div>
  );
}
