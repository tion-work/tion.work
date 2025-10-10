import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class QrCodeGeneratorTool extends BaseTool {
  id = "qr-code-generator";
  name = "二维码生成器";
  description = "生成二维码图片";
  category: ToolCategory = "utility";
  icon = "qrcode";
  color = "bg-indigo-500";
  inputLanguage = "text";
  inputPlaceholder = "请输入要生成二维码的内容...";
  outputLanguage = "text";
  initialInput = "";
  options = [
    {
      name: "size",
      label: "尺寸",
      type: "number" as const,
      defaultValue: 200,
      description: "二维码图片尺寸（像素）",
    },
    {
      name: "errorCorrectionLevel",
      label: "纠错级别",
      type: "select" as const,
      defaultValue: "M",
      options: [
        { label: "L (7%)", value: "L" },
        { label: "M (15%)", value: "M" },
        { label: "Q (25%)", value: "Q" },
        { label: "H (30%)", value: "H" },
      ],
      description: "二维码纠错级别",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "QR Code Generator",
        description: "Generate QR code images",
        inputPlaceholder: "Please enter content to generate QR code...",
        options: [
          {
            name: "size",
            label: "Size",
            type: "number",
            defaultValue: 200,
            description: "QR code image size (pixels)",
          },
          {
            name: "errorCorrectionLevel",
            label: "Error Correction Level",
            type: "select",
            defaultValue: "M",
            description: "QR code error correction level",
          },
        ],
      };
    }

    return {
      name: "二维码生成器",
      description: "生成二维码图片",
      inputPlaceholder: "请输入要生成二维码的内容...",
      options: [
        {
          name: "size",
          label: "尺寸",
          type: "number",
          defaultValue: 200,
          description: "二维码图片尺寸（像素）",
        },
        {
          name: "errorCorrectionLevel",
          label: "纠错级别",
          type: "select",
          defaultValue: "M",
          description: "二维码纠错级别",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { size = 200, errorCorrectionLevel = "M" } = options;

    if (!input.trim()) {
      return "";
    }

    try {
      // 这里应该使用实际的二维码生成库
      // 为了演示，我们返回一个模拟的二维码数据URL
      const qrData = {
        content: input.trim(),
        size: size,
        errorCorrectionLevel: errorCorrectionLevel,
        timestamp: new Date().toISOString(),
      };

      // 模拟生成二维码
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="white"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="monospace" font-size="12">
            QR Code: ${input.trim().substring(0, 20)}${
        input.trim().length > 20 ? "..." : ""
      }
          </text>
        </svg>
      `)}`;
    } catch (error) {
      throw new Error(
        `二维码生成失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }
}
