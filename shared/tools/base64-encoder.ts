import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class Base64EncoderTool extends BaseTool {
  id = 'base64-encoder';
  name = 'Base64 编码器';
  description = 'Base64 编码和解码工具';
  category: ToolCategory = 'data';
  icon = 'lock';
  options = [
    {
      key: 'operation',
      label: '操作',
      type: 'select' as const,
      defaultValue: 'encode',
      options: [
        { label: '编码', value: 'encode' },
        { label: '解码', value: 'decode' },
      ],
      description: '选择编码或解码操作',
    },
    {
      key: 'urlSafe',
      label: 'URL 安全',
      type: 'boolean' as const,
      defaultValue: false,
      description: '使用 URL 安全的 Base64 编码',
    },
  ];

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    try {
      const { operation = 'encode', urlSafe = false } = options;
      
      if (!input.trim()) {
        return '';
      }

      if (operation === 'encode') {
        return this.encode(input, urlSafe);
      } else {
        return this.decode(input, urlSafe);
      }
    } catch (error) {
      throw new Error(`Base64 处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }
    
    // 对于编码操作，任何输入都是有效的
    // 对于解码操作，需要检查是否为有效的 Base64
    try {
      // 移除可能的空白字符
      const cleaned = input.replace(/\s/g, '');
      
      // 检查 Base64 字符集
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleaned)) {
        return false;
      }
      
      // 尝试解码
      atob(cleaned);
      return true;
    } catch {
      return false;
    }
  }

  private encode(input: string, urlSafe: boolean): string {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    
    if (urlSafe) {
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    return encoded;
  }

  private decode(input: string, urlSafe: boolean): string {
    let cleaned = input.replace(/\s/g, '');
    
    if (urlSafe) {
      cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
      // 添加必要的填充
      while (cleaned.length % 4) {
        cleaned += '=';
      }
    }
    
    return decodeURIComponent(escape(atob(cleaned)));
  }
}
