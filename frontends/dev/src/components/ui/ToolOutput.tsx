"use client";

import { Card } from "@/components/ui/Card";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { useLanguage } from "@/contexts/LanguageContext";
import { OutputType } from "@/types";
import { Copy, Download } from "lucide-react";
import { useState } from "react";

interface ToolOutputProps {
  type: OutputType;
  value: string;
  language?: string;
  className?: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

export function ToolOutput({
  type,
  value,
  language,
  className = "",
  onCopy,
  onDownload,
}: ToolOutputProps) {
  const { content } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    onDownload?.();
  };

  const renderContent = () => {
    switch (type) {
      case "text":
        return (
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {value}
          </div>
        );

      case "code":
        return (
          <CodeEditor
            language={language || "text"}
            value={value}
            onChange={() => {}}
            readOnly
            height="300px"
          />
        );

      case "html":
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                查看HTML源码
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {value}
              </pre>
            </details>
          </div>
        );

      case "json":
        try {
          const parsed = JSON.parse(value);
          return (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(parsed, null, 2)}
                </pre>
              </div>
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  查看原始JSON
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {value}
                </pre>
              </details>
            </div>
          );
        } catch {
          return (
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {value}
            </div>
          );
        }

      case "image":
        return (
          <div className="text-center">
            <img
              src={value}
              alt="Generated image"
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden text-sm text-gray-500 mt-4">
              图片加载失败，请检查数据格式
            </div>
          </div>
        );

      case "file":
        return (
          <div className="text-center p-8">
            <div className="text-sm text-gray-600 mb-4">
              文件内容已生成，点击下载按钮保存
            </div>
            <div className="text-xs text-gray-500 font-mono break-all">
              {value.substring(0, 200)}
              {value.length > 200 && "..."}
            </div>
          </div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap text-sm text-gray-700">
            {value}
          </div>
        );
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {renderContent()}

        {value && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {/* 对于图片类型，只显示下载按钮 */}
              {type === "image" ? (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>下载图片</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span>
                      {copied
                        ? content.common.copied || "已复制"
                        : content.common.copy || "复制"}
                    </span>
                  </button>

                  {(type === "text" ||
                    type === "code" ||
                    type === "json" ||
                    type === "html") && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>{content.common.download || "下载"}</span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {type === "image"
                ? content.common.image || "图片"
                : `${value.length} ${content.common.characters || "字符"}`}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
