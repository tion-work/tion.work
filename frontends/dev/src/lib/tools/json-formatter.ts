import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class JsonFormatterTool extends BaseTool {
  id = "json-formatter";
  name = "JSON Formatter";
  description = "格式化 JSON 数据，支持压缩和美化";
  category: ToolCategory = "code";
  icon = "code";
  color = "bg-blue-500";
  inputLanguage = "json";
  inputPlaceholder = "请输入 JSON 数据...";
  outputLanguage = "json";
  initialInput = "";
  options = [
    {
      name: "indent",
      label: "缩进",
      type: "number" as const,
      defaultValue: 2,
      description: "缩进空格数",
    },
    {
      name: "sortKeys",
      label: "排序键",
      type: "boolean" as const,
      defaultValue: false,
      description: "是否按字母顺序排序键",
    },
    {
      name: "minify",
      label: "压缩",
      type: "boolean" as const,
      defaultValue: false,
      description: "压缩 JSON 输出",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "JSON Formatter",
        description:
          "Format JSON data with compression and beautification support",
        inputPlaceholder: "Please enter JSON data...",
        options: [
          {
            name: "indent",
            label: "Indent",
            type: "number",
            defaultValue: 2,
            description: "Number of spaces for indentation",
          },
          {
            name: "sortKeys",
            label: "Sort Keys",
            type: "boolean",
            defaultValue: false,
            description: "Sort keys alphabetically",
          },
          {
            name: "minify",
            label: "Minify",
            type: "boolean",
            defaultValue: false,
            description: "Minify JSON output",
          },
        ],
      };
    }

    return {
      name: "JSON 格式化",
      description: "格式化 JSON 数据，支持压缩和美化",
      inputPlaceholder: "请输入 JSON 数据...",
      options: [
        {
          name: "indent",
          label: "缩进",
          type: "number",
          defaultValue: 2,
          description: "缩进空格数",
        },
        {
          name: "sortKeys",
          label: "排序键",
          type: "boolean",
          defaultValue: false,
          description: "是否按字母顺序排序键",
        },
        {
          name: "minify",
          label: "压缩",
          type: "boolean",
          defaultValue: false,
          description: "压缩 JSON 输出",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    try {
      const { indent = 2, sortKeys = false, minify = false } = options;

      if (!input.trim()) {
        return "";
      }

      const parsed = JSON.parse(input);

      if (minify) {
        return JSON.stringify(parsed);
      }

      if (sortKeys) {
        const sorted = this.sortObjectKeys(parsed);
        return JSON.stringify(sorted, null, indent);
      }

      return JSON.stringify(parsed, null, indent);
    } catch (error) {
      throw new Error(
        `JSON 解析失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
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

  private sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.sortObjectKeys(item));
    }

    if (obj !== null && typeof obj === "object") {
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj: any = {};

      for (const key of sortedKeys) {
        sortedObj[key] = this.sortObjectKeys(obj[key]);
      }

      return sortedObj;
    }

    return obj;
  }
}
