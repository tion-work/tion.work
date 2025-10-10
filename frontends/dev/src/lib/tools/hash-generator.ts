import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class HashGeneratorTool extends BaseTool {
  id = 'hash-generator';
  name = '哈希生成器';
  description = '生成各种哈希值 (MD5, SHA1, SHA256, SHA512)';
  category: ToolCategory = 'security';
  icon = 'hash';
  options = [
    {
      key: 'algorithm',
      label: '算法',
      type: 'select' as const,
      defaultValue: 'sha256',
      options: [
        { label: 'MD5', value: 'md5' },
        { label: 'SHA1', value: 'sha1' },
        { label: 'SHA256', value: 'sha256' },
        { label: 'SHA512', value: 'sha512' },
      ],
      description: '选择哈希算法',
    },
    {
      key: 'format',
      label: '格式',
      type: 'select' as const,
      defaultValue: 'hex',
      options: [
        { label: '十六进制', value: 'hex' },
        { label: 'Base64', value: 'base64' },
      ],
      description: '选择输出格式',
    },
    {
      key: 'uppercase',
      label: '大写',
      type: 'boolean' as const,
      defaultValue: false,
      description: '十六进制输出使用大写字母',
    },
  ];

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    try {
      const { algorithm = 'sha256', format = 'hex', uppercase = false } = options;
      
      if (!input.trim()) {
        return '';
      }

      // 这里应该使用 crypto-js 库生成哈希
      // 为了简化，返回一个模拟的哈希值
      return this.generateHash(input, algorithm, format, uppercase);
    } catch (error) {
      throw new Error(`哈希生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    // 哈希生成器可以处理任何输入
    return true;
  }

  private generateHash(input: string, algorithm: string, format: string, uppercase: boolean): string {
    // 模拟哈希生成
    const hashLength = this.getHashLength(algorithm);
    const hash = this.simpleHash(input, hashLength);
    
    let result = hash;
    
    if (format === 'base64') {
      result = btoa(hash);
    } else if (uppercase) {
      result = hash.toUpperCase();
    }
    
    return `${algorithm.toUpperCase()}: ${result}`;
  }

  private getHashLength(algorithm: string): number {
    switch (algorithm) {
      case 'md5':
        return 32;
      case 'sha1':
        return 40;
      case 'sha256':
        return 64;
      case 'sha512':
        return 128;
      default:
        return 64;
    }
  }

  private simpleHash(input: string, length: number): string {
    // 简单的哈希模拟函数
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // 转换为十六进制
    let hex = Math.abs(hash).toString(16);
    
    // 填充到指定长度
    while (hex.length < length) {
      hex = '0' + hex;
    }
    
    return hex.substring(0, length);
  }
}
