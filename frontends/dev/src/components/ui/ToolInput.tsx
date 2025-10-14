"use client";

import { CodeEditor } from "@/components/ui/CodeEditor";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { InputType } from "@/types";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface ToolInputProps {
  type: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  className?: string;
}

export function ToolInput({
  type,
  value,
  onChange,
  placeholder,
  language,
  className = "",
}: ToolInputProps) {
  const { content } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  switch (type) {
    case "none":
      return null;

    case "text":
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      );

    case "textarea":
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
          rows={6}
        />
      );

    case "code":
      return (
        <CodeEditor
          language={language || "text"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          height="200px"
        />
      );

    case "file":
      return (
        <div className={`relative ${className}`}>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {value
                ? content.common.clickToReselectFile || "点击重新选择文件"
                : content.common.clickToUploadFile || "点击上传文件"}
            </p>
            {value && (
              <p className="text-xs text-gray-500">
                {content.common.fileSelected || "已选择文件"}，
                {content.common.contentLength || "内容长度"}: {value.length}{" "}
                {content.common.characters || "字符"}
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".txt,.json,.csv,.xml,.yaml,.yml"
          />
        </div>
      );

    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
      );
  }
}
