import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class XMLValidatorTool extends BaseTool {
  id = "xml-validator";
  name = "XML Validator";
  description = "Validate and format XML data";
  category: ToolCategory = "code";
  icon = "file-code";
  color = "bg-blue-500";
  inputType: InputType = "code";
  outputType: OutputType = "text";
  inputLanguage = "xml";
  inputPlaceholder = "Enter XML to validate...";
  outputLanguage = "text";
  initialInput =
    '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>Value</item>\n</root>';
  options = [
    {
      name: "format",
      label: "Format Output",
      type: "boolean" as const,
      defaultValue: true,
      description: "Format the XML output",
    },
    {
      name: "indent",
      label: "Indent",
      type: "number" as const,
      defaultValue: 2,
      description: "Number of spaces for indentation",
    },
    {
      name: "checkWellFormed",
      label: "Check Well-Formed",
      type: "boolean" as const,
      defaultValue: true,
      description: "Check if XML is well-formed",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "XML Validator",
        description: "Validate and format XML data",
        inputPlaceholder: "Enter XML to validate...",
        options: [
          {
            name: "format",
            label: "Format Output",
            type: "boolean",
            defaultValue: true,
            description: "Format the XML output",
          },
          {
            name: "indent",
            label: "Indent",
            type: "number",
            defaultValue: 2,
            description: "Number of spaces for indentation",
          },
          {
            name: "checkWellFormed",
            label: "Check Well-Formed",
            type: "boolean",
            defaultValue: true,
            description: "Check if XML is well-formed",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "XMLバリデーター",
        description: "XMLデータを検証・フォーマット",
        inputPlaceholder: "検証するXMLを入力してください...",
        options: this.options,
      };
    }

    return {
      name: "XML 验证器",
      description: "验证和格式化 XML 数据",
      inputPlaceholder: "请输入要验证的 XML...",
      options: [
        {
          name: "format",
          label: "格式化输出",
          type: "boolean",
          defaultValue: true,
          description: "格式化 XML 输出",
        },
        {
          name: "indent",
          label: "缩进",
          type: "number",
          defaultValue: 2,
          description: "缩进空格数",
        },
        {
          name: "checkWellFormed",
          label: "检查格式",
          type: "boolean",
          defaultValue: true,
          description: "检查 XML 是否格式正确",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { format = true, indent = 2, checkWellFormed = true } = options;

    if (!input.trim()) {
      return "Please provide XML to validate.";
    }

    try {
      // Basic XML validation
      const validationResult = this.validateXML(input);

      if (!validationResult.valid) {
        return `❌ Invalid XML\n\nError: ${validationResult.error}\n\n--- Suggestions ---\n• Check for matching opening and closing tags\n• Ensure proper XML declaration\n• Verify attribute syntax\n• Check for special characters`;
      }

      let result = input;

      if (format) {
        result = this.formatXML(input, indent);
      }

      const summary = {
        valid: true,
        wellFormed: validationResult.valid,
        elementCount: this.countElements(input),
        hasDeclaration: input.includes("<?xml"),
        formatted: format,
      };

      return `✅ Valid XML\n\n${result}\n\n--- Validation Summary ---\n${JSON.stringify(
        summary,
        null,
        2
      )}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return `❌ XML Processing Error\n\nError: ${errorMessage}`;
    }
  }

  private validateXML(xml: string): { valid: boolean; error?: string } {
    // Basic XML validation
    const trimmed = xml.trim();

    // Check for proper tag matching
    const openTags = trimmed.match(/<[^\/][^>]*>/g) || [];
    const closeTags = trimmed.match(/<\/[^>]*>/g) || [];
    const selfClosingTags = trimmed.match(/<[^>]*\/>/g) || [];

    // Simple validation - check if we have matching tags
    const allOpenTags = openTags.length + selfClosingTags.length;
    const allCloseTags = closeTags.length + selfClosingTags.length;

    if (allOpenTags !== allCloseTags) {
      return { valid: false, error: "Mismatched opening and closing tags" };
    }

    // Check for basic XML structure
    if (!trimmed.includes("<") || !trimmed.includes(">")) {
      return { valid: false, error: "No XML tags found" };
    }

    return { valid: true };
  }

  private formatXML(xml: string, indent: number): string {
    // Simple XML formatting
    let formatted = xml;
    const spaces = " ".repeat(indent);
    let level = 0;
    let result = "";

    const lines = formatted.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        result += "\n";
        continue;
      }

      if (trimmed.startsWith("</")) {
        level--;
      }

      result += spaces.repeat(level) + trimmed + "\n";

      if (
        trimmed.startsWith("<") &&
        !trimmed.startsWith("</") &&
        !trimmed.endsWith("/>")
      ) {
        level++;
      }
    }

    return result.trim();
  }

  private countElements(xml: string): number {
    const matches = xml.match(/<[^\/][^>]*>/g);
    return matches ? matches.length : 0;
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    const result = this.validateXML(input);
    return result.valid;
  }
}
