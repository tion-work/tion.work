import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class XMLFormatterTool extends BaseTool {
  id = "xml-formatter";
  name = "XML 格式化器";
  description = "美化和格式化 XML 代码，支持缩进和验证";
  category: ToolCategory = "code";
  icon = "code";
  color = "bg-blue-500";
  inputType: InputType = "code";
  outputType: OutputType = "code";
  inputLanguage = "xml";
  inputPlaceholder = "请输入 XML 代码...";
  outputLanguage = "xml";
  initialInput = "<root><item>value</item></root>";
  options = [
    {
      name: "indentSize",
      label: "缩进大小",
      type: "number" as const,
      defaultValue: 2,
      description: "缩进空格数",
    },
    {
      name: "indentType",
      label: "缩进类型",
      type: "select" as const,
      defaultValue: "space",
      options: [
        { label: "空格", value: "space" },
        { label: "制表符", value: "tab" },
      ],
      description: "选择缩进类型",
    },
    {
      name: "preserveComments",
      label: "保留注释",
      type: "boolean" as const,
      defaultValue: true,
      description: "是否保留 XML 注释",
    },
    {
      name: "sortAttributes",
      label: "排序属性",
      type: "boolean" as const,
      defaultValue: false,
      description: "是否按字母顺序排序属性",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "XML Formatter",
        description:
          "Format and beautify XML code with indentation and validation",
        inputPlaceholder: "Please enter XML code...",
        options: [
          {
            name: "indentSize",
            label: "Indent Size",
            type: "number",
            defaultValue: 2,
            description: "Number of spaces for indentation",
          },
          {
            name: "indentType",
            label: "Indent Type",
            type: "select",
            defaultValue: "space",
            description: "Choose indentation type",
            options: [
              { label: "Space", value: "space" },
              { label: "Tab", value: "tab" },
            ],
          },
          {
            name: "preserveComments",
            label: "Preserve Comments",
            type: "boolean",
            defaultValue: true,
            description: "Whether to preserve XML comments",
          },
          {
            name: "sortAttributes",
            label: "Sort Attributes",
            type: "boolean",
            defaultValue: false,
            description: "Whether to sort attributes alphabetically",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "XMLフォーマッター",
        description: "インデントと検証でXMLコードをフォーマット・美化",
        inputPlaceholder: "XMLコードを入力してください...",
        options: [
          {
            name: "indentSize",
            label: "インデントサイズ",
            type: "number",
            defaultValue: 2,
            description: "インデントのスペース数",
          },
          {
            name: "indentType",
            label: "インデントタイプ",
            type: "select",
            defaultValue: "space",
            description: "インデントタイプを選択",
            options: [
              { label: "スペース", value: "space" },
              { label: "タブ", value: "tab" },
            ],
          },
          {
            name: "preserveComments",
            label: "コメントを保持",
            type: "boolean",
            defaultValue: true,
            description: "XMLコメントを保持するかどうか",
          },
          {
            name: "sortAttributes",
            label: "属性をソート",
            type: "boolean",
            defaultValue: false,
            description: "属性をアルファベット順にソートするかどうか",
          },
        ],
      };
    }

    return {
      name: this.name,
      description: this.description,
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",
      options: this.options,
    };
  }

  async process(input: string, options: any = {}): Promise<string> {
    const {
      indentSize = 2,
      indentType = "space",
      preserveComments = true,
      sortAttributes = false,
    } = options;

    try {
      return this.formatXML(input, {
        indentSize,
        indentType,
        preserveComments,
        sortAttributes,
      });
    } catch (error) {
      throw new Error(
        `XML 格式化失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    try {
      // 简单的 XML 验证
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      return !doc.getElementsByTagName("parsererror").length;
    } catch {
      return false;
    }
  }

  private formatXML(xml: string, options: any): string {
    let formatted = xml.trim();

    // 如果输入是单行，先进行基本的格式化
    if (!formatted.includes("\n")) {
      formatted = this.formatSingleLineXML(formatted);
    }

    // 移除多余的空行
    formatted = formatted.replace(/\n\s*\n\s*\n/g, "\n\n");

    // 添加适当的缩进
    const lines = formatted.split("\n");
    let indentLevel = 0;
    const indent =
      options.indentType === "tab" ? "\t" : " ".repeat(options.indentSize);

    const processedLines = lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return "";

      // 检查标签类型
      const isClosingTag = trimmed.startsWith("</");
      const isSelfClosing = trimmed.endsWith("/>");
      const isProcessingInstruction = trimmed.startsWith("<?");
      const isComment = trimmed.startsWith("<!--");
      const isOpeningTag =
        trimmed.startsWith("<") &&
        !isClosingTag &&
        !isProcessingInstruction &&
        !isComment &&
        !isSelfClosing;

      // 对于结束标签，使用减少后的缩进级别
      if (isClosingTag) {
        const currentIndentLevel = Math.max(0, indentLevel - 1);
        const indentedLine = indent.repeat(currentIndentLevel) + trimmed;
        indentLevel = currentIndentLevel; // 更新全局缩进级别
        return indentedLine;
      }

      // 对于开始标签，使用当前缩进级别，然后增加缩进级别
      if (isOpeningTag) {
        const indentedLine = indent.repeat(indentLevel) + trimmed;
        indentLevel++;
        return indentedLine;
      }

      // 对于其他标签（注释、处理指令、自闭合标签），使用当前缩进级别
      return indent.repeat(indentLevel) + trimmed;
    });

    formatted = processedLines.join("\n");

    return formatted;
  }

  private formatSingleLineXML(xml: string): string {
    // 在标签之间添加换行
    let formatted = xml
      .replace(/></g, ">\n<") // 在标签之间添加换行
      .replace(/<\?/g, "\n<?") // XML声明前添加换行
      .replace(/\?>/g, "?>\n") // XML声明后添加换行
      .replace(/<!--/g, "\n<!--") // 注释前添加换行
      .replace(/-->/g, "-->\n") // 注释后添加换行
      .trim();

    // 清理多余的空行
    formatted = formatted.replace(/\n\s*\n/g, "\n");

    return formatted;
  }
}
