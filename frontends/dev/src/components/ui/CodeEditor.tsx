"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  placeholder = "",
  readOnly = false,
  height = "300px",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [Editor, setEditor] = useState<any>(null);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const { default: MonacoEditor } = await import("@monaco-editor/react");
        setEditor(() => MonacoEditor);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load Monaco Editor:", error);
        setIsLoading(false);
      }
    };

    loadEditor();
  }, []);

  if (typeof window === "undefined" || isLoading) {
    // Server-side rendering fallback or loading state
    return (
      <div
        className={cn(
          "flex min-h-[300px] w-full items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-4 font-mono text-sm",
          readOnly && "bg-gray-100"
        )}
        style={{ height }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span>Loading editor...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">{value || placeholder}</pre>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-md border border-gray-300 overflow-hidden"
      style={{ height }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-light"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: "selection",
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: "line",
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
