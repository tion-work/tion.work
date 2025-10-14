import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class URLShortenerTool extends BaseTool {
  id = "url-shortener";
  name = "URL 短链接生成器";
  description = "生成短链接和二维码，支持自定义短码";
  category: ToolCategory = "utility";
  icon = "link";
  color = "bg-blue-500";
  inputType: InputType = "text";
  outputType: OutputType = "text";
  inputLanguage = undefined;
  inputPlaceholder = "请输入要缩短的URL...";
  outputLanguage = undefined;
  initialInput = "https://www.example.com/very/long/url/path";
  options = [];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "URL Shortener",
        description:
          "Generate short links and QR codes with custom short codes",
        inputPlaceholder: "Please enter URL to shorten...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "URL短縮ツール",
        description: "カスタム短縮コードで短縮リンクとQRコードを生成",
        inputPlaceholder: "短縮するURLを入力してください...",
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
      customCode = "",
      domain = "dev.tion.work",
      generateQR = true,
      analytics = false,
    } = options;

    try {
      return this.shortenURL(input, {
        customCode,
        domain,
        generateQR,
        analytics,
      });
    } catch (error) {
      throw new Error(
        `URL 缩短失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }

  private shortenURL(url: string, options: any): string {
    const { customCode, domain, generateQR, analytics } = options;

    // 生成短码
    const shortCode = customCode || this.generateShortCode();
    const shortURL = `https://${domain}/${shortCode}`;

    const result: any = {
      original: {
        url: url,
        length: url.length,
      },
      shortened: {
        url: shortURL,
        code: shortCode,
        length: shortURL.length,
        savings: url.length - shortURL.length,
        savingsPercent: Math.round(
          ((url.length - shortURL.length) / url.length) * 100
        ),
      },
      metadata: {
        domain: domain,
        generatedAt: new Date().toISOString(),
        analytics: analytics,
      },
    };

    // 生成二维码数据
    if (generateQR) {
      result.qrCode = {
        data: shortURL,
        size: 200,
        format: "svg",
      };
    }

    // 生成统计信息
    result.stats = {
      originalLength: url.length,
      shortLength: shortURL.length,
      compressionRatio: Math.round((shortURL.length / url.length) * 100),
      estimatedClicks: Math.floor(Math.random() * 1000) + 100, // 模拟数据
    };

    return JSON.stringify(result, null, 2);
  }

  private generateShortCode(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
