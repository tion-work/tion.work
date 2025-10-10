import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class ColorPickerTool extends BaseTool {
  id = 'color-picker';
  name = '颜色选择器';
  description = '颜色选择、转换和调色板生成';
  category: ToolCategory = 'design';
  icon = 'palette';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      format = 'hex',
      generatePalette = false,
      paletteType = 'monochromatic'
    } = options;

    try {
      return this.processColor(input, { format, generatePalette, paletteType });
    } catch (error) {
      throw new Error(`颜色处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    // 验证颜色格式
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const hslPattern = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;
    
    return hexPattern.test(input) || rgbPattern.test(input) || hslPattern.test(input);
  }

  private processColor(input: string, options: any): string {
    const { format, generatePalette, paletteType } = options;
    
    // 解析输入颜色
    const color = this.parseColor(input);
    if (!color) {
      return '无效的颜色格式';
    }
    
    const result: any = {
      input: input,
      hex: this.rgbToHex(color.r, color.g, color.b),
      rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
      hsl: this.rgbToHsl(color.r, color.g, color.b),
      hsv: this.rgbToHsv(color.r, color.g, color.b),
      cmyk: this.rgbToCmyk(color.r, color.g, color.b)
    };
    
    // 生成调色板
    if (generatePalette) {
      result.palette = this.generatePalette(color, paletteType);
    }
    
    return JSON.stringify(result, null, 2);
  }

  private parseColor(input: string): { r: number; g: number; b: number } | null {
    // 解析 HEX 格式
    const hexMatch = input.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
      };
    }
    
    // 解析 RGB 格式
    const rgbMatch = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }
    
    // 解析 HSL 格式
    const hslMatch = input.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) / 360;
      const s = parseInt(hslMatch[2]) / 100;
      const l = parseInt(hslMatch[3]) / 100;
      return this.hslToRgb(h, s, l);
    }
    
    return null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private rgbToHsl(r: number, g: number, b: number): string {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  private rgbToHsv(r: number, g: number, b: number): string {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff) % 6; break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
    }
    
    const s = max === 0 ? 0 : diff / max;
    const v = max;
    
    return `hsv(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
  }

  private rgbToCmyk(r: number, g: number, b: number): string {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  private generatePalette(color: { r: number; g: number; b: number }, type: string): any[] {
    const palette = [];
    
    if (type === 'monochromatic') {
      // 单色调色板
      for (let i = 0; i < 5; i++) {
        const factor = 0.2 + (i * 0.2);
        palette.push({
          name: `Shade ${i + 1}`,
          hex: this.rgbToHex(
            Math.round(color.r * factor),
            Math.round(color.g * factor),
            Math.round(color.b * factor)
          )
        });
      }
    } else if (type === 'complementary') {
      // 互补色调色板
      const compR = 255 - color.r;
      const compG = 255 - color.g;
      const compB = 255 - color.b;
      
      palette.push({
        name: 'Original',
        hex: this.rgbToHex(color.r, color.g, color.b)
      });
      palette.push({
        name: 'Complement',
        hex: this.rgbToHex(compR, compG, compB)
      });
    }
    
    return palette;
  }
}
