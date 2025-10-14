import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class TextDiffTool extends BaseTool {
  id = "text-diff";
  name = "Text Diff";
  description = "Compare two text documents and show differences";
  category: ToolCategory = "text";
  icon = "git-compare";
  color = "bg-purple-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter first text...";
  outputLanguage = "text";
  initialInput = "Original text\nLine 2\nLine 3";
  options = [
    {
      name: "ignoreWhitespace",
      label: "Ignore Whitespace",
      type: "boolean" as const,
      defaultValue: false,
      description: "Ignore whitespace differences",
    },
    {
      name: "ignoreCase",
      label: "Ignore Case",
      type: "boolean" as const,
      defaultValue: false,
      description: "Ignore case differences",
    },
    {
      name: "contextLines",
      label: "Context Lines",
      type: "number" as const,
      defaultValue: 3,
      description: "Number of context lines to show",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "Text Diff",
        description: "Compare two text documents and show differences",
        inputPlaceholder: "Enter first text...",
        options: [
          {
            name: "ignoreWhitespace",
            label: "Ignore Whitespace",
            type: "boolean",
            defaultValue: false,
            description: "Ignore whitespace differences",
          },
          {
            name: "ignoreCase",
            label: "Ignore Case",
            type: "boolean",
            defaultValue: false,
            description: "Ignore case differences",
          },
          {
            name: "contextLines",
            label: "Context Lines",
            type: "number",
            defaultValue: 3,
            description: "Number of context lines to show",
          },
        ],
      };
    }

    return {
      name: "文本对比",
      description: "比较两个文本文档并显示差异",
      inputPlaceholder: "请输入第一个文本...",
      options: [
        {
          name: "ignoreWhitespace",
          label: "忽略空白",
          type: "boolean",
          defaultValue: false,
          description: "忽略空白字符差异",
        },
        {
          name: "ignoreCase",
          label: "忽略大小写",
          type: "boolean",
          defaultValue: false,
          description: "忽略大小写差异",
        },
        {
          name: "contextLines",
          label: "上下文行数",
          type: "number",
          defaultValue: 3,
          description: "显示的上下文行数",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const {
      ignoreWhitespace = false,
      ignoreCase = false,
      contextLines = 3,
    } = options;

    if (!input.trim()) {
      return "Please provide text to compare.";
    }

    // Split input into two parts (separated by a delimiter)
    const parts = input.split("\n---\n");
    if (parts.length !== 2) {
      return "Please separate the two texts with '---' on a new line.\n\nExample:\nText 1\n---\nText 2";
    }

    const [text1, text2] = parts;
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");

    let result = "=== Text Comparison ===\n\n";
    result += `Text 1: ${lines1.length} lines\n`;
    result += `Text 2: ${lines2.length} lines\n\n`;

    // Simple diff algorithm
    const maxLines = Math.max(lines1.length, lines2.length);
    let differences = 0;

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      let processedLine1 = line1;
      let processedLine2 = line2;

      if (ignoreWhitespace) {
        processedLine1 = line1.trim();
        processedLine2 = line2.trim();
      }

      if (ignoreCase) {
        processedLine1 = processedLine1.toLowerCase();
        processedLine2 = processedLine2.toLowerCase();
      }

      if (processedLine1 !== processedLine2) {
        differences++;
        result += `Line ${i + 1}:\n`;
        result += `  - ${line1}\n`;
        result += `  + ${line2}\n\n`;
      }
    }

    result += `\nTotal differences: ${differences}`;

    return result;
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }
}
