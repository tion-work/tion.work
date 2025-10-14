import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class CSSMinifierTool extends BaseTool {
  id = "css-minifier";
  name = "CSS 压缩器";
  description = "压缩 CSS 代码，移除空白字符和注释，减少文件大小";
  category: ToolCategory = "code";
  icon = "file-text";
  color = "bg-blue-500";
  inputType: InputType = "code";
  outputType: OutputType = "code";
  inputLanguage = "css";
  inputPlaceholder = "请输入 CSS 代码...";
  outputLanguage = "css";
  initialInput =
    "body {\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}";
  options = [];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "CSS Minifier",
        description:
          "Minify CSS code, remove whitespace and comments, reduce file size",
        inputPlaceholder: "Please enter CSS code...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "CSSミニファイアー",
        description:
          "CSSコードを圧縮し、空白とコメントを削除してファイルサイズを削減",
        inputPlaceholder: "CSSコードを入力してください...",
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
      removeComments = true,
      removeEmptyRules = true,
      removeEmptySelectors = true,
      removeRedundantProperties = true,
      removeUnusedCSS = false,
      minifySelectors = true,
      minifyValues = true,
    } = options;

    try {
      return this.minifyCSS(input, {
        removeComments,
        removeEmptyRules,
        removeEmptySelectors,
        removeRedundantProperties,
        removeUnusedCSS,
        minifySelectors,
        minifyValues,
      });
    } catch (error) {
      throw new Error(
        `CSS 压缩失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    // 简单的 CSS 验证
    return input.trim().length > 0;
  }

  private minifyCSS(css: string, options: any): string {
    let minified = css;

    // 移除注释
    if (options.removeComments) {
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, "");
    }

    // 移除多余的空白字符
    minified = minified.replace(/\s+/g, " ");

    // 移除分号前的空白
    minified = minified.replace(/\s*;\s*/g, ";");

    // 移除冒号前后的空白
    minified = minified.replace(/\s*:\s*/g, ":");

    // 移除逗号后的空白
    minified = minified.replace(/,\s+/g, ",");

    // 移除大括号前后的空白
    minified = minified.replace(/\s*{\s*/g, "{");
    minified = minified.replace(/\s*}\s*/g, "}");

    // 移除分号后的空白
    minified = minified.replace(/;\s*/g, ";");

    // 移除行首行尾的空白
    minified = minified.replace(/^\s+|\s+$/g, "");

    // 移除空规则
    if (options.removeEmptyRules) {
      minified = minified.replace(/[^{}]+{\s*}/g, "");
    }

    // 移除空选择器
    if (options.removeEmptySelectors) {
      minified = minified.replace(/[^{}]*{\s*}/g, "");
    }

    // 压缩颜色值
    if (options.minifyValues) {
      // 压缩十六进制颜色
      minified = minified.replace(
        /#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
        "#$1$2$3"
      );

      // 压缩 RGB 颜色
      minified = minified.replace(
        /rgb\s*\(\s*0\s*,\s*0\s*,\s*0\s*\)/g,
        "black"
      );
      minified = minified.replace(
        /rgb\s*\(\s*255\s*,\s*255\s*,\s*255\s*\)/g,
        "white"
      );
    }

    // 移除冗余属性
    if (options.removeRedundantProperties) {
      // 移除重复的属性
      const rules = minified.split("}");
      const processedRules = rules.map((rule) => {
        const [selector, properties] = rule.split("{");
        if (!properties) return rule;

        const propList = properties.split(";").filter((p) => p.trim());
        const uniqueProps = new Map();

        propList.forEach((prop) => {
          const [key, value] = prop.split(":");
          if (key && value) {
            uniqueProps.set(key.trim(), value.trim());
          }
        });

        const uniquePropString = Array.from(uniqueProps.entries())
          .map(([key, value]) => `${key}:${value}`)
          .join(";");

        return `${selector}{${uniquePropString}}`;
      });

      minified = processedRules.join("}");
    }

    return minified;
  }
}
