import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class JSONValidatorTool extends BaseTool {
  id = "json-validator";
  name = "JSON Validator";
  description = "Validate and format JSON data";
  category: ToolCategory = "code";
  icon = "check-circle";
  color = "bg-green-500";
  inputLanguage = "json";
  inputPlaceholder = "Enter JSON to validate...";
  outputLanguage = "json";
  initialInput = '{"name": "John", "age": 30}';
  options = [
    {
      name: "strict",
      label: "Strict Mode",
      type: "boolean" as const,
      defaultValue: false,
      description: "Use strict JSON validation",
    },
    {
      name: "format",
      label: "Format Output",
      type: "boolean" as const,
      defaultValue: true,
      description: "Format the JSON output",
    },
    {
      name: "indent",
      label: "Indent",
      type: "number" as const,
      defaultValue: 2,
      description: "Number of spaces for indentation",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "JSON Validator",
        description: "Validate and format JSON data",
        inputPlaceholder: "Enter JSON to validate...",
        options: [
          {
            name: "strict",
            label: "Strict Mode",
            type: "boolean",
            defaultValue: false,
            description: "Use strict JSON validation",
          },
          {
            name: "format",
            label: "Format Output",
            type: "boolean",
            defaultValue: true,
            description: "Format the JSON output",
          },
          {
            name: "indent",
            label: "Indent",
            type: "number",
            defaultValue: 2,
            description: "Number of spaces for indentation",
          },
        ],
      };
    }

    return {
      name: "JSON 验证器",
      description: "验证和格式化 JSON 数据",
      inputPlaceholder: "请输入要验证的 JSON...",
      options: [
        {
          name: "strict",
          label: "严格模式",
          type: "boolean",
          defaultValue: false,
          description: "使用严格的 JSON 验证",
        },
        {
          name: "format",
          label: "格式化输出",
          type: "boolean",
          defaultValue: true,
          description: "格式化 JSON 输出",
        },
        {
          name: "indent",
          label: "缩进",
          type: "number",
          defaultValue: 2,
          description: "缩进空格数",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { strict = false, format = true, indent = 2 } = options;

    if (!input.trim()) {
      return "Please provide JSON to validate.";
    }

    try {
      const parsed = JSON.parse(input);

      let result = "";

      if (format) {
        result = JSON.stringify(parsed, null, indent);
      } else {
        result = JSON.stringify(parsed);
      }

      // Add validation summary
      const summary = {
        valid: true,
        type: Array.isArray(parsed) ? "array" : typeof parsed,
        size: Array.isArray(parsed)
          ? parsed.length
          : Object.keys(parsed).length,
        formatted: format,
      };

      return `✅ Valid JSON\n\n${result}\n\n--- Validation Summary ---\n${JSON.stringify(
        summary,
        null,
        2
      )}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return `❌ Invalid JSON\n\nError: ${errorMessage}\n\n--- Suggestions ---\n• Check for missing quotes around keys\n• Ensure all strings are properly quoted\n• Verify bracket and brace matching\n• Remove trailing commas`;
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }
}
