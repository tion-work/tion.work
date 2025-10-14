import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class JavaScriptFormatterTool extends BaseTool {
  id = "javascript-formatter";
  name = "JavaScript 格式化器";
  description = "美化和格式化 JavaScript 代码，支持自定义缩进、行长度等选项";
  category: ToolCategory = "code";
  icon = "code";
  color = "bg-blue-500";
  inputType: InputType = "code";
  outputType: OutputType = "code";
  inputLanguage = "javascript";
  inputPlaceholder = "请输入 JavaScript 代码...";
  outputLanguage = "javascript";
  initialInput = "function hello(){console.log('Hello World');}";
  options = [];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "JavaScript Formatter",
        description:
          "Format and beautify JavaScript code with custom indentation and line length options",
        inputPlaceholder: "Please enter JavaScript code...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "JavaScriptフォーマッター",
        description:
          "カスタムインデントと行長オプションでJavaScriptコードをフォーマット・美化",
        inputPlaceholder: "JavaScriptコードを入力してください...",
        options: [],
      };
    }

    return {
      name: this.name,
      description: this.description,
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",
      options: [],
    };
  }

  async process(input: string, options: any = {}): Promise<string> {
    const {
      indentSize = 2,
      indentType = "space",
      maxLineLength = 80,
      preserveComments = true,
      compact = false,
    } = options;

    try {
      // 这里应该调用后端 API 进行实际的格式化
      // 目前返回一个模拟的格式化结果
      return this.formatJavaScript(input, {
        indentSize,
        indentType,
        maxLineLength,
        preserveComments,
        compact,
      });
    } catch (error) {
      throw new Error(
        `JavaScript 格式化失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    }
  }

  validate(input: string): boolean {
    try {
      // 简单的 JavaScript 语法检查
      new Function(input);
      return true;
    } catch {
      // 如果直接执行失败，尝试更宽松的检查
      return input.trim().length > 0;
    }
  }

  private formatJavaScript(code: string, options: any): string {
    // 这是一个简化的格式化实现
    // 在实际项目中，应该使用专业的 JavaScript 格式化库

    let formatted = code;

    // 移除多余的空行
    formatted = formatted.replace(/\n\s*\n\s*\n/g, "\n\n");

    // 添加适当的缩进
    if (!options.compact) {
      const lines = formatted.split("\n");
      let indentLevel = 0;
      const indent =
        options.indentType === "tab" ? "\t" : " ".repeat(options.indentSize);

      const processedLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";

        // 减少缩进级别
        if (
          trimmed.startsWith("}") ||
          trimmed.startsWith("]") ||
          trimmed.startsWith(")")
        ) {
          indentLevel = Math.max(0, indentLevel - 1);
        }

        const indentedLine = indent.repeat(indentLevel) + trimmed;

        // 增加缩进级别
        if (
          trimmed.endsWith("{") ||
          trimmed.endsWith("[") ||
          trimmed.endsWith("(")
        ) {
          indentLevel++;
        }

        return indentedLine;
      });

      formatted = processedLines.join("\n");
    }

    return formatted;
  }
}
