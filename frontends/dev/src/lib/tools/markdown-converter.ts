import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class MarkdownConverterTool extends BaseTool {
  id = "markdown-converter";
  name = "Markdown Converter";
  description = "Convert Markdown to HTML or other formats";
  category: ToolCategory = "text";
  icon = "file-text";
  color = "bg-green-500";
  inputType: InputType = "textarea";
  outputType: OutputType = "html";
  inputLanguage = "markdown";
  inputPlaceholder = "Enter Markdown content...";
  outputLanguage = "html";
  initialInput = "# Hello World\n\nThis is **bold** text.";
  options = [
    {
      name: "format",
      label: "Output Format",
      type: "select" as const,
      defaultValue: "html",
      description: "Choose output format",
      options: [
        { label: "HTML", value: "html" },
        { label: "Plain Text", value: "text" },
        { label: "JSON", value: "json" },
      ],
    },
    {
      name: "includeStyles",
      label: "Include Styles",
      type: "boolean" as const,
      defaultValue: false,
      description: "Include CSS styles in HTML output",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "Markdown Converter",
        description: "Convert Markdown to HTML or other formats",
        inputPlaceholder: "Enter Markdown content...",
        options: [
          {
            name: "format",
            label: "Output Format",
            type: "select",
            defaultValue: "html",
            description: "Choose output format",
            options: [
              { label: "HTML", value: "html" },
              { label: "Plain Text", value: "text" },
              { label: "JSON", value: "json" },
            ],
          },
          {
            name: "includeStyles",
            label: "Include Styles",
            type: "boolean",
            defaultValue: false,
            description: "Include CSS styles in HTML output",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "Markdownコンバーター",
        description: "MarkdownをHTMLやその他の形式に変換",
        inputPlaceholder: "Markdownコンテンツを入力してください...",
        options: [
          {
            name: "format",
            label: "出力形式",
            type: "select",
            defaultValue: "html",
            description: "出力形式を選択",
            options: [
              { label: "HTML", value: "html" },
              { label: "プレーンテキスト", value: "text" },
              { label: "JSON", value: "json" },
            ],
          },
          {
            name: "includeStyles",
            label: "スタイルを含める",
            type: "boolean",
            defaultValue: false,
            description: "HTML出力にCSSスタイルを含める",
          },
        ],
      };
    }

    return {
      name: "Markdown 转换器",
      description: "将 Markdown 转换为 HTML 或其他格式",
      inputPlaceholder: "请输入 Markdown 内容...",
      options: [
        {
          name: "format",
          label: "输出格式",
          type: "select",
          defaultValue: "html",
          description: "选择输出格式",
          options: [
            { label: "HTML", value: "html" },
            { label: "纯文本", value: "text" },
            { label: "JSON", value: "json" },
          ],
        },
        {
          name: "includeStyles",
          label: "包含样式",
          type: "boolean",
          defaultValue: false,
          description: "在 HTML 输出中包含 CSS 样式",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { format = "html", includeStyles = false } = options;

    if (!input.trim()) {
      return "";
    }

    // Simple Markdown to HTML converter
    let html = input
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/\n/gim, "<br>");

    if (format === "html") {
      if (includeStyles) {
        html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
      }
      return html;
    } else if (format === "text") {
      return input
        .replace(/\*\*(.*?)\*\*/gim, "$1")
        .replace(/\*(.*?)\*/gim, "$1");
    } else if (format === "json") {
      return JSON.stringify({ content: html, original: input }, null, 2);
    }

    return html;
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }
}
