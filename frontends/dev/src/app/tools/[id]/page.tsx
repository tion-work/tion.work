"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/ui/CodeEditor";
import Loading from "@/components/ui/Loading";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToolRegistry } from "@/lib/tools";
import { BaseTool } from "@/lib/tools/base";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { useAddToHistory } from "@/stores/useAppStore";
import { Copy, Download, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ToolPage() {
  const { content, language } = useLanguage();
  const params = useParams();
  const addToHistory = useAddToHistory();
  const [tool, setTool] = useState<BaseTool | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (params.id) {
      const toolInstance = ToolRegistry.get(params.id as string);
      if (toolInstance) {
        setTool(toolInstance);
        setInput(toolInstance.initialInput || "");

        // 初始化选项默认值，使用多语言内容
        const localizedContent = toolInstance.getLocalizedContent(
          language || "zh"
        );
        const defaultOptions: Record<string, any> = {};
        localizedContent.options?.forEach((option) => {
          defaultOptions[option.name] = option.defaultValue;
        });
        setOptions(defaultOptions);
      }
      setIsInitializing(false);
    }
  }, [params.id, language]);

  const handleProcess = async () => {
    if (!tool) return;

    setLoading(true);
    setError(null);

    try {
      const result = await tool.process(input, options);
      setOutput(result);

      // 添加到历史记录
      addToHistory({
        toolId: tool.id,
        toolName: tool.name,
        input,
        output: result,
        timestamp: new Date().toISOString(),
      });

      // 处理完成后自动滚动到输出区域
      setTimeout(() => {
        const outputElement = document.getElementById("output-section");
        if (outputElement) {
          outputElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    copyToClipboard(output);
  };

  const handleDownload = () => {
    if (tool) {
      downloadFile(output, `${tool.name}-output.txt`);
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  // 初始化期间显示加载状态
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="text-gray-600 mt-4">
            {content.common.loadingTool || "加载工具中..."}
          </p>
        </div>
      </div>
    );
  }

  // 工具未找到
  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            {content.common.toolNotFound || "工具未找到"}
          </h1>
          <p className="text-secondary-600">
            {content.common.toolNotFoundDesc || "请检查工具 ID 是否正确"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - 极简设计 */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">
                {tool.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tool.getLocalizedContent(language || "zh").name}
              </h1>
              <p className="text-gray-600">
                {tool.getLocalizedContent(language || "zh").description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 1. 输入内容区域 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {content.common.input}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                {content.common.reset}
              </Button>
            </div>
            <CodeEditor
              language={tool.inputLanguage ?? "text"}
              value={input}
              onChange={setInput}
              placeholder={
                tool.getLocalizedContent(language || "zh").inputPlaceholder ??
                (content.common.inputPlaceholder || "请输入内容...")
              }
              height="300px"
            />
          </div>

          {/* 2. 选项区域（如果需要的话） */}
          {tool.options && tool.options.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {content.common.options}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tool
                  .getLocalizedContent(language || "zh")
                  .options.map((option) => (
                    <div key={option.name} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {option.label}
                      </label>
                      {option.type === "select" ? (
                        <select
                          value={options[option.name] || option.defaultValue}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              [option.name]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {option.options?.map(
                            (opt: { label: string; value: any }) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            )
                          )}
                        </select>
                      ) : option.type === "boolean" ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`option-${option.name}`}
                            checked={
                              options[option.name] ||
                              option.defaultValue ||
                              false
                            }
                            onChange={(e) =>
                              setOptions({
                                ...options,
                                [option.name]: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <label
                            htmlFor={`option-${option.name}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ) : (
                        <input
                          type={option.type}
                          value={options[option.name] || option.defaultValue}
                          onChange={(e) =>
                            setOptions({
                              ...options,
                              [option.name]:
                                option.type === "number"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={option.description}
                        />
                      )}
                      {option.description && (
                        <p className="text-xs text-gray-500">
                          {option.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* 3. 处理按钮 */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleProcess}
              disabled={!input.trim() || loading}
              size="lg"
              className="px-12 py-3 text-lg font-semibold"
            >
              {loading ? content.common.processing : content.common.process}
            </Button>
          </div>

          {/* 4. 输出内容区域 */}
          <div id="output-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {content.common.result}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output || loading}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {content.common.copy}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!output || loading}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {content.common.download}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loading />
              </div>
            ) : (
              <CodeEditor
                language={tool.outputLanguage ?? "text"}
                value={output}
                onChange={() => {}}
                readOnly
                placeholder={
                  content.common.resultPlaceholder || "处理结果将显示在这里..."
                }
                height="300px"
              />
            )}
          </div>

          {/* 错误显示 */}
          {error && (
            <Card className="p-6 mt-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-sm font-medium">错误：</span>
                <span className="text-sm">{error}</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
