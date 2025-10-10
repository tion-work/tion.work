#!/bin/bash

# 批量更新工具文件以支持多语言

TOOLS_DIR="frontends/dev/src/lib/tools"

# 更新密码生成器
cat > "$TOOLS_DIR/password-generator.ts" << 'EOF'
import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class PasswordGeneratorTool extends BaseTool {
  id = 'password-generator';
  name = '密码生成器';
  description = '生成安全的随机密码';
  category: ToolCategory = 'security';
  icon = 'shield';
  color = "bg-red-500";
  inputLanguage = "text";
  inputPlaceholder = "点击生成密码...";
  outputLanguage = "text";
  initialInput = "";
  options = [
    {
      name: 'length',
      label: '长度',
      type: 'number' as const,
      defaultValue: 12,
      description: '密码长度',
    },
    {
      name: 'includeUppercase',
      label: '大写字母',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含大写字母',
    },
    {
      name: 'includeLowercase',
      label: '小写字母',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含小写字母',
    },
    {
      name: 'includeNumbers',
      label: '数字',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含数字',
    },
    {
      name: 'includeSymbols',
      label: '特殊符号',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含特殊符号',
    },
  ];

  getLocalizedContent(language: 'zh' | 'en') {
    if (language === 'en') {
      return {
        name: "Password Generator",
        description: "Generate secure random passwords",
        inputPlaceholder: "Click to generate password...",
        options: [
          {
            name: 'length',
            label: 'Length',
            type: 'number',
            defaultValue: 12,
            description: 'Password length',
          },
          {
            name: 'includeUppercase',
            label: 'Uppercase',
            type: 'boolean',
            defaultValue: true,
            description: 'Include uppercase letters',
          },
          {
            name: 'includeLowercase',
            label: 'Lowercase',
            type: 'boolean',
            defaultValue: true,
            description: 'Include lowercase letters',
          },
          {
            name: 'includeNumbers',
            label: 'Numbers',
            type: 'boolean',
            defaultValue: true,
            description: 'Include numbers',
          },
          {
            name: 'includeSymbols',
            label: 'Symbols',
            type: 'boolean',
            defaultValue: true,
            description: 'Include special symbols',
          },
        ],
      };
    }

    return {
      name: "密码生成器",
      description: "生成安全的随机密码",
      inputPlaceholder: "点击生成密码...",
      options: [
        {
          name: 'length',
          label: '长度',
          type: 'number',
          defaultValue: 12,
          description: '密码长度',
        },
        {
          name: 'includeUppercase',
          label: '大写字母',
          type: 'boolean',
          defaultValue: true,
          description: '包含大写字母',
        },
        {
          name: 'includeLowercase',
          label: '小写字母',
          type: 'boolean',
          defaultValue: true,
          description: '包含小写字母',
        },
        {
          name: 'includeNumbers',
          label: '数字',
          type: 'boolean',
          defaultValue: true,
          description: '包含数字',
        },
        {
          name: 'includeSymbols',
          label: '特殊符号',
          type: 'boolean',
          defaultValue: true,
          description: '包含特殊符号',
        },
      ],
    };
  }

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true
    } = options;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      throw new Error('至少选择一种字符类型');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  validate(input: string): boolean {
    return true;
  }
}
EOF

# 更新时间戳转换器
cat > "$TOOLS_DIR/timestamp-converter.ts" << 'EOF'
import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class TimestampConverterTool extends BaseTool {
  id = 'timestamp-converter';
  name = '时间戳转换器';
  description = '时间戳与日期格式相互转换';
  category: ToolCategory = 'utility';
  icon = 'clock';
  color = "bg-orange-500";
  inputLanguage = "text";
  inputPlaceholder = "请输入时间戳或日期...";
  outputLanguage = "text";
  initialInput = "";
  options = [
    {
      name: 'inputFormat',
      label: '输入格式',
      type: 'select' as const,
      defaultValue: 'auto',
      options: [
        { label: '自动检测', value: 'auto' },
        { label: '时间戳（秒）', value: 'timestamp' },
        { label: '时间戳（毫秒）', value: 'timestamp_ms' },
        { label: 'ISO 8601', value: 'iso' },
        { label: 'YYYY-MM-DD', value: 'date' },
      ],
      description: '选择输入格式',
    },
    {
      name: 'outputFormat',
      label: '输出格式',
      type: 'select' as const,
      defaultValue: 'iso',
      options: [
        { label: 'ISO 8601', value: 'iso' },
        { label: '时间戳（秒）', value: 'timestamp' },
        { label: '时间戳（毫秒）', value: 'timestamp_ms' },
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'datetime' },
        { label: 'YYYY-MM-DD', value: 'date' },
      ],
      description: '选择输出格式',
    },
  ];

  getLocalizedContent(language: 'zh' | 'en') {
    if (language === 'en') {
      return {
        name: "Timestamp Converter",
        description: "Convert between timestamps and date formats",
        inputPlaceholder: "Please enter timestamp or date...",
        options: [
          {
            name: 'inputFormat',
            label: 'Input Format',
            type: 'select',
            defaultValue: 'auto',
            description: 'Choose input format',
          },
          {
            name: 'outputFormat',
            label: 'Output Format',
            type: 'select',
            defaultValue: 'iso',
            description: 'Choose output format',
          },
        ],
      };
    }

    return {
      name: "时间戳转换器",
      description: "时间戳与日期格式相互转换",
      inputPlaceholder: "请输入时间戳或日期...",
      options: [
        {
          name: 'inputFormat',
          label: '输入格式',
          type: 'select',
          defaultValue: 'auto',
          description: '选择输入格式',
        },
        {
          name: 'outputFormat',
          label: '输出格式',
          type: 'select',
          defaultValue: 'iso',
          description: '选择输出格式',
        },
      ],
    };
  }

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    const { inputFormat = 'auto', outputFormat = 'iso' } = options;

    if (!input.trim()) {
      return '';
    }

    try {
      let date: Date;

      if (inputFormat === 'auto') {
        // 自动检测格式
        if (/^\d{10}$/.test(input.trim())) {
          // 10位时间戳（秒）
          date = new Date(parseInt(input.trim()) * 1000);
        } else if (/^\d{13}$/.test(input.trim())) {
          // 13位时间戳（毫秒）
          date = new Date(parseInt(input.trim()));
        } else {
          // 尝试解析为日期字符串
          date = new Date(input.trim());
        }
      } else if (inputFormat === 'timestamp') {
        date = new Date(parseInt(input.trim()) * 1000);
      } else if (inputFormat === 'timestamp_ms') {
        date = new Date(parseInt(input.trim()));
      } else {
        date = new Date(input.trim());
      }

      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }

      // 根据输出格式格式化
      switch (outputFormat) {
        case 'iso':
          return date.toISOString();
        case 'timestamp':
          return Math.floor(date.getTime() / 1000).toString();
        case 'timestamp_ms':
          return date.getTime().toString();
        case 'datetime':
          return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        case 'date':
          return date.toLocaleDateString('zh-CN');
        default:
          return date.toISOString();
      }
    } catch (error) {
      throw new Error(`转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      // 尝试解析输入
      if (/^\d{10}$/.test(input.trim()) || /^\d{13}$/.test(input.trim())) {
        return true;
      }

      const date = new Date(input.trim());
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }
}
EOF

# 更新二维码生成器
cat > "$TOOLS_DIR/qr-code-generator.ts" << 'EOF'
import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class QRCodeGeneratorTool extends BaseTool {
  id = 'qr-code-generator';
  name = '二维码生成器';
  description = '生成二维码图片';
  category: ToolCategory = 'utility';
  icon = 'qrcode';
  color = "bg-indigo-500";
  inputLanguage = "text";
  inputPlaceholder = "请输入要生成二维码的内容...";
  outputLanguage = "text";
  initialInput = "";
  options = [
    {
      name: 'size',
      label: '尺寸',
      type: 'number' as const,
      defaultValue: 200,
      description: '二维码图片尺寸（像素）',
    },
    {
      name: 'errorCorrectionLevel',
      label: '纠错级别',
      type: 'select' as const,
      defaultValue: 'M',
      options: [
        { label: 'L (7%)', value: 'L' },
        { label: 'M (15%)', value: 'M' },
        { label: 'Q (25%)', value: 'Q' },
        { label: 'H (30%)', value: 'H' },
      ],
      description: '二维码纠错级别',
    },
  ];

  getLocalizedContent(language: 'zh' | 'en') {
    if (language === 'en') {
      return {
        name: "QR Code Generator",
        description: "Generate QR code images",
        inputPlaceholder: "Please enter content to generate QR code...",
        options: [
          {
            name: 'size',
            label: 'Size',
            type: 'number',
            defaultValue: 200,
            description: 'QR code image size (pixels)',
          },
          {
            name: 'errorCorrectionLevel',
            label: 'Error Correction Level',
            type: 'select',
            defaultValue: 'M',
            description: 'QR code error correction level',
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
          name: 'size',
          label: '尺寸',
          type: 'number',
          defaultValue: 200,
          description: '二维码图片尺寸（像素）',
        },
        {
          name: 'errorCorrectionLevel',
          label: '纠错级别',
          type: 'select',
          defaultValue: 'M',
          description: '二维码纠错级别',
        },
      ],
    };
  }

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    const { size = 200, errorCorrectionLevel = 'M' } = options;

    if (!input.trim()) {
      return '';
    }

    try {
      // 这里应该使用实际的二维码生成库
      // 为了演示，我们返回一个模拟的二维码数据URL
      const qrData = {
        content: input.trim(),
        size: size,
        errorCorrectionLevel: errorCorrectionLevel,
        timestamp: new Date().toISOString()
      };

      // 模拟生成二维码
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="white"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="monospace" font-size="12">
            QR Code: ${input.trim().substring(0, 20)}${input.trim().length > 20 ? '...' : ''}
          </text>
        </svg>
      `)}`;
    } catch (error) {
      throw new Error(`二维码生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }
}
EOF

echo "✅ 工具文件多语言支持更新完成！"
