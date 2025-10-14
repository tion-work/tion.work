import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class UrlEncoderTool extends BaseTool {
  id = "url-encoder";
  name = "URL 编码器";
  description = "URL 编码和解码工具";
  category: ToolCategory = "data";
  icon = "link";
  color = "bg-blue-500";
  inputType: InputType = "textarea";
  outputType: OutputType = "text";
  inputLanguage = undefined;
  inputPlaceholder = "请输入要编码/解码的文本...";
  outputLanguage = undefined;
  initialInput = "Hello World!";
  options = [
    {
      name: "operation",
      label: "操作",
      type: "select" as const,
      defaultValue: "encode",
      options: [
        { label: "编码", value: "encode" },
        { label: "解码", value: "decode" },
      ],
      description: "选择编码或解码操作",
    },
    {
      name: "component",
      label: "组件类型",
      type: "select" as const,
      defaultValue: "all",
      options: [
        { label: "全部", value: "all" },
        { label: "路径", value: "pathname" },
        { label: "查询参数", value: "search" },
        { label: "哈希", value: "hash" },
      ],
      description: "选择要编码/解码的 URL 组件",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "URL Encoder",
        description: "URL encoding and decoding tool",
        inputPlaceholder: "Please enter text to encode/decode...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "URLエンコーダー",
        description: "URLエンコード・デコードツール",
        inputPlaceholder:
          "エンコード/デコードするテキストを入力してください...",
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

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    try {
      const { operation = "encode", component = "all" } = options;

      if (!input.trim()) {
        return "";
      }

      if (operation === "encode") {
        return this.encode(input, component);
      } else {
        return this.decode(input, component);
      }
    } catch (error) {
      throw new Error(
        `URL 处理失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    // 对于编码操作，任何输入都是有效的
    // 对于解码操作，需要检查是否为有效的 URL 编码
    try {
      // 检查是否包含 URL 编码字符
      const hasEncodedChars = /%[0-9A-Fa-f]{2}/.test(input);

      if (hasEncodedChars) {
        // 尝试解码
        decodeURIComponent(input);
        return true;
      }

      return true;
    } catch {
      return false;
    }
  }

  private encode(input: string, component: string): string {
    switch (component) {
      case "pathname":
        return encodeURI(input);
      case "search":
        return encodeURIComponent(input);
      case "hash":
        return encodeURIComponent(input);
      case "all":
      default:
        return encodeURIComponent(input);
    }
  }

  private decode(input: string, component: string): string {
    try {
      switch (component) {
        case "pathname":
          return decodeURI(input);
        case "search":
        case "hash":
        case "all":
        default:
          return decodeURIComponent(input);
      }
    } catch (error) {
      throw new Error("URL 解码失败，请检查输入格式");
    }
  }
}
