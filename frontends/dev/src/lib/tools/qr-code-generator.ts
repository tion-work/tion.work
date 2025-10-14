import { InputType, OutputType, ToolCategory } from "@/types";
import * as QRCode from "qrcode";
import { BaseTool } from "./base";

export class QrCodeGeneratorTool extends BaseTool {
  id = "qr-code-generator";
  name = "二维码生成器";
  description = "生成二维码图片";
  category: ToolCategory = "utility";
  icon = "qrcode";
  color = "bg-indigo-500";
  inputType: InputType = "textarea";
  outputType: OutputType = "image";
  inputLanguage = undefined;
  inputPlaceholder = "请输入要生成二维码的内容...";
  outputLanguage = undefined;
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

  getLocalizedContent(language: "zh" | "en" | "ja") {
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
            options: [
              { label: "L (7%)", value: "L" },
              { label: "M (15%)", value: "M" },
              { label: "Q (25%)", value: "Q" },
              { label: "H (30%)", value: "H" },
            ],
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "QRコードジェネレーター",
        description: "QRコード画像を生成",
        inputPlaceholder: "QRコードを生成する内容を入力してください...",
        options: [
          {
            name: "size",
            label: "サイズ",
            type: "number",
            defaultValue: 200,
            description: "QRコード画像サイズ（ピクセル）",
          },
          {
            name: "errorCorrectionLevel",
            label: "エラー訂正レベル",
            type: "select",
            defaultValue: "M",
            description: "QRコードエラー訂正レベル",
            options: [
              { label: "L (7%)", value: "L" },
              { label: "M (15%)", value: "M" },
              { label: "Q (25%)", value: "Q" },
              { label: "H (30%)", value: "H" },
            ],
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
          options: [
            { label: "L (7%)", value: "L" },
            { label: "M (15%)", value: "M" },
            { label: "Q (25%)", value: "Q" },
            { label: "H (30%)", value: "H" },
          ],
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
      // 使用 qrcode 库生成真正的二维码
      const qrCodeDataURL = await QRCode.toDataURL(input.trim(), {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: errorCorrectionLevel as any,
      });

      return qrCodeDataURL;
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
