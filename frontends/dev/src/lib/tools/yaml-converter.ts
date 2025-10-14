import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class YAMLConverterTool extends BaseTool {
  id = "yaml-converter";
  name = "YAML Converter";
  description = "Convert between YAML and JSON formats";
  category: ToolCategory = "data";
  icon = "file-code";
  color = "bg-yellow-500";
  inputLanguage = "yaml";
  inputPlaceholder = "Enter YAML or JSON content...";
  outputLanguage = "yaml";
  initialInput = "name: John Doe\nage: 30\ncity: New York";
  options = [
    {
      name: "operation",
      label: "Operation",
      type: "select" as const,
      defaultValue: "yaml-to-json",
      description: "Choose conversion direction",
      options: [
        { label: "YAML to JSON", value: "yaml-to-json" },
        { label: "JSON to YAML", value: "json-to-yaml" },
      ],
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
        name: "YAML Converter",
        description: "Convert between YAML and JSON formats",
        inputPlaceholder: "Enter YAML or JSON content...",
        options: [
          {
            name: "operation",
            label: "Operation",
            type: "select",
            defaultValue: "yaml-to-json",
            description: "Choose conversion direction",
            options: [
              { label: "YAML to JSON", value: "yaml-to-json" },
              { label: "JSON to YAML", value: "json-to-yaml" },
            ],
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
      name: "YAML 转换器",
      description: "在 YAML 和 JSON 格式之间转换",
      inputPlaceholder: "请输入 YAML 或 JSON 内容...",
      options: [
        {
          name: "operation",
          label: "操作",
          type: "select",
          defaultValue: "yaml-to-json",
          description: "选择转换方向",
          options: [
            { label: "YAML 转 JSON", value: "yaml-to-json" },
            { label: "JSON 转 YAML", value: "json-to-yaml" },
          ],
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
    const { operation = "yaml-to-json", indent = 2 } = options;

    if (!input.trim()) {
      return "";
    }

    try {
      if (operation === "yaml-to-json") {
        // Simple YAML to JSON conversion
        const lines = input.split("\n");
        const result: any = {};

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const colonIndex = trimmed.indexOf(":");
            if (colonIndex > 0) {
              const key = trimmed.substring(0, colonIndex).trim();
              const value = trimmed.substring(colonIndex + 1).trim();
              result[key] = isNaN(Number(value)) ? value : Number(value);
            }
          }
        }

        return JSON.stringify(result, null, indent);
      } else {
        // Simple JSON to YAML conversion
        const parsed = JSON.parse(input);
        let yaml = "";

        for (const [key, value] of Object.entries(parsed)) {
          yaml += `${key}: ${value}\n`;
        }

        return yaml.trim();
      }
    } catch (error) {
      throw new Error(
        `Conversion failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      // Try to parse as JSON first
      JSON.parse(input);
      return true;
    } catch {
      // If not JSON, assume it's YAML
      return input.includes(":");
    }
  }
}
