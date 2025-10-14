"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";
import { ToolInput } from "@/components/ui/ToolInput";
import { ToolOutput } from "@/components/ui/ToolOutput";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToolRegistry } from "@/lib/tools";
import { BaseTool } from "@/lib/tools/base";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { useAddToHistory } from "@/stores/useAppStore";
import { RotateCcw } from "lucide-react";
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
    const startTime = Date.now();

    try {
      const result = await tool.process(String(input), options);
      const processingTime = (Date.now() - startTime) / 1000; // 转换为秒

      setOutput(result);

      // 添加到历史记录
      addToHistory({
        toolId: tool.id,
        toolName: tool.getLocalizedContent(language || "zh").name,
        input: String(input),
        output: result,
        timestamp: new Date().toISOString(),
      });

      // 统计功能已移除

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
      const processingTime = (Date.now() - startTime) / 1000;

      // 统计功能已移除
      setError(err instanceof Error ? err.message : "处理失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    copyToClipboard(output);
  };

  const handleDownload = () => {
    if (output && tool) {
      // 根据输出类型确定文件扩展名和MIME类型
      let filename: string;
      let mimeType: string;
      let content: string;

      const localizedToolName = tool.getLocalizedContent(language || "zh").name;
      switch (tool.outputType) {
        case "image":
          filename = `${localizedToolName}-output.png`;
          mimeType = "image/png";
          // 对于图片，如果是 Data URL，直接使用 Data URL 创建下载链接
          if (output.startsWith("data:")) {
            const link = document.createElement("a");
            link.href = output;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
          }
          content = output;
          break;
        case "json":
          filename = `${localizedToolName}-output.json`;
          mimeType = "application/json";
          content = output;
          break;
        case "html":
          filename = `${localizedToolName}-output.html`;
          mimeType = "text/html";
          content = output;
          break;
        case "code":
          filename = `${localizedToolName}-output.txt`;
          mimeType = "text/plain";
          content = output;
          break;
        default:
          filename = `${localizedToolName}-output.txt`;
          mimeType = "text/plain";
          content = output;
      }

      downloadFile(content, filename, mimeType);
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
                {tool.getLocalizedContent(language || "zh").name.charAt(0)}
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
          {tool.inputType !== "none" && (
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
              <ToolInput
                type={tool.inputType}
                value={input}
                onChange={setInput}
                placeholder={
                  tool.getLocalizedContent(language || "zh").inputPlaceholder ??
                  (content.common.inputPlaceholder || "请输入内容...")
                }
                language={tool.inputLanguage}
              />
            </div>
          )}

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
                              options[option.name] !== undefined
                                ? options[option.name]
                                : option.defaultValue
                            }
                            onChange={(e) => {
                              const newValue = e.target.checked;
                              const newOptions = {
                                ...options,
                                [option.name]: newValue,
                              };

                              // 对于密码生成器，确保至少选择一种字符类型
                              if (tool.id === "password-generator") {
                                const charTypeOptions = [
                                  "includeUppercase",
                                  "includeLowercase",
                                  "includeNumbers",
                                  "includeSymbols",
                                ];

                                if (
                                  charTypeOptions.includes(option.name) &&
                                  !newValue
                                ) {
                                  // 检查是否还有其他字符类型被选中
                                  const hasOtherCharTypes = charTypeOptions
                                    .filter((name) => name !== option.name)
                                    .some((name) => newOptions[name] === true);

                                  if (!hasOtherCharTypes) {
                                    // 如果没有其他字符类型被选中，阻止取消选择
                                    return;
                                  }
                                }
                              }

                              setOptions(newOptions);
                            }}
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
              disabled={
                (tool.inputType !== "none" && !String(input).trim()) || loading
              }
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
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loading />
              </div>
            ) : (
              <ToolOutput
                type={tool.outputType}
                value={output}
                language={tool.outputLanguage}
                onCopy={handleCopy}
                onDownload={handleDownload}
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
