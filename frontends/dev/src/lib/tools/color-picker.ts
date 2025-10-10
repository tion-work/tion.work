import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class ColorPickerTool extends BaseTool {
  id = "color-picker";
  name = "Color Picker";
  description = "颜色选择器和格式转换工具，支持多种颜色格式";
  category: ToolCategory = "design";
  icon = "palette";
  color = "bg-blue-500";
  inputLanguage = "text";
  inputPlaceholder = "请输入颜色值（如 #FF0000, rgb(255,0,0), red）...";
  outputLanguage = "text";
  initialInput = "";
  options = [
    {
      name: "format",
      label: "输出格式",
      type: "select" as const,
      defaultValue: "hex",
      options: [
        { label: "HEX (#FF0000)", value: "hex" },
        { label: "RGB (255,0,0)", value: "rgb" },
        { label: "RGBA (255,0,0,1)", value: "rgba" },
        { label: "HSL (0,100%,50%)", value: "hsl" },
        { label: "HSLA (0,100%,50%,1)", value: "hsla" },
        { label: "HSV (0,100%,100%)", value: "hsv" },
        { label: "CMYK (0,100,100,0)", value: "cmyk" },
      ],
      description: "输出颜色格式",
    },
    {
      name: "generatePalette",
      label: "生成调色板",
      type: "boolean" as const,
      defaultValue: false,
      description: "是否生成相关调色板",
    },
    {
      name: "paletteType",
      label: "调色板类型",
      type: "select" as const,
      defaultValue: "monochromatic",
      options: [
        { label: "单色系", value: "monochromatic" },
        { label: "互补色", value: "complementary" },
        { label: "三角色", value: "triadic" },
        { label: "四色系", value: "tetradic" },
        { label: "相似色", value: "analogous" },
      ],
      description: "调色板生成类型",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "Color Picker",
        description:
          "Color picker and format conversion tool supporting multiple color formats",
        inputPlaceholder:
          "Please enter color value (e.g., #FF0000, rgb(255,0,0), red)...",
        options: [],
      };
    }

    return {
      name: "颜色选择器",
      description: "颜色选择器和格式转换工具，支持多种颜色格式",
      inputPlaceholder: "请输入颜色值（如 #FF0000, rgb(255,0,0), red）...",
      options: [],
    };
  }

  async process(input: string, options: Record<string, any>): Promise<string> {
    try {
      const { format, generatePalette, paletteType } = options;

      // 解析输入颜色
      const color = this.parseColor(input);
      if (!color) {
        throw new Error("无法解析输入的颜色值");
      }

      // 转换颜色格式
      const convertedColor = this.convertColor(color, format);

      let result = `输入颜色: ${input}\n`;
      result += `解析结果: RGB(${color.r}, ${color.g}, ${color.b})\n`;
      result += `转换格式: ${convertedColor}\n`;

      if (generatePalette) {
        const palette = this.generateColorPalette(color, paletteType);
        result += `\n调色板 (${paletteType}):\n`;
        palette.forEach((color, index) => {
          result += `${index + 1}. ${color}\n`;
        });
      }

      return result;
    } catch (error) {
      throw new Error(this.formatError(error as Error));
    }
  }

  validate(input: string): boolean {
    return input.trim().length > 0 && this.parseColor(input) !== null;
  }

  private parseColor(
    input: string
  ): { r: number; g: number; b: number } | null {
    const trimmed = input.trim().toLowerCase();

    // HEX 格式
    if (/^#[0-9a-f]{3}$/.test(trimmed)) {
      const hex = trimmed.slice(1);
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }

    if (/^#[0-9a-f]{6}$/.test(trimmed)) {
      return {
        r: parseInt(trimmed.slice(1, 3), 16),
        g: parseInt(trimmed.slice(3, 5), 16),
        b: parseInt(trimmed.slice(5, 7), 16),
      };
    }

    // RGB 格式
    const rgbMatch = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
      };
    }

    // 预定义颜色名称
    const colorNames: Record<string, { r: number; g: number; b: number }> = {
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 128, b: 0 },
      blue: { r: 0, g: 0, b: 255 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 },
      yellow: { r: 255, g: 255, b: 0 },
      cyan: { r: 0, g: 255, b: 255 },
      magenta: { r: 255, g: 0, b: 255 },
    };

    return colorNames[trimmed] || null;
  }

  private convertColor(
    color: { r: number; g: number; b: number },
    format: string
  ): string {
    switch (format) {
      case "hex":
        return `#${color.r.toString(16).padStart(2, "0")}${color.g
          .toString(16)
          .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
      case "rgb":
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
      case "rgba":
        return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
      case "hsl":
        const hsl = this.rgbToHsl(color.r, color.g, color.b);
        return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(
          hsl.l
        )}%)`;
      case "hsla":
        const hsla = this.rgbToHsl(color.r, color.g, color.b);
        return `hsla(${Math.round(hsla.h)}, ${Math.round(
          hsla.s
        )}%, ${Math.round(hsla.l)}%, 1)`;
      case "hsv":
        const hsv = this.rgbToHsv(color.r, color.g, color.b);
        return `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(
          hsv.v
        )}%)`;
      case "cmyk":
        const cmyk = this.rgbToCmyk(color.r, color.g, color.b);
        return `cmyk(${Math.round(cmyk.c)}%, ${Math.round(
          cmyk.m
        )}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`;
      default:
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
  }

  private rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private rgbToHsv(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }

    return {
      h: Math.round(h * 60),
      s: Math.round(max === 0 ? 0 : (diff / max) * 100),
      v: Math.round(max * 100),
    };
  }

  private rgbToCmyk(
    r: number,
    g: number,
    b: number
  ): { c: number; m: number; y: number; k: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    };
  }

  private generateColorPalette(
    color: { r: number; g: number; b: number },
    type: string
  ): string[] {
    const palette: string[] = [];

    // 简化的调色板生成逻辑
    switch (type) {
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          const factor = 0.2 + i * 0.2;
          palette.push(
            `rgb(${Math.round(color.r * factor)}, ${Math.round(
              color.g * factor
            )}, ${Math.round(color.b * factor)})`
          );
        }
        break;
      case "complementary":
        palette.push(`rgb(${color.r}, ${color.g}, ${color.b})`);
        palette.push(
          `rgb(${255 - color.r}, ${255 - color.g}, ${255 - color.b})`
        );
        break;
      default:
        palette.push(`rgb(${color.r}, ${color.g}, ${color.b})`);
    }

    return palette;
  }
}
