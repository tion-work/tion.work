import { Tool, ToolProcessRequest, ToolProcessResponse, ToolCategory } from '../types';
import logger from '../lib/logger';
import { performanceLogger } from '../lib/logger';

// 工具实现
class JsonFormatterTool {
  async process(input: string, options: any = {}): Promise<string> {
    const { indent = 2, sortKeys = false, minify = false } = options;
    
    if (!input.trim()) {
      return '';
    }

    const parsed = JSON.parse(input);
    
    if (minify) {
      return JSON.stringify(parsed);
    }

    if (sortKeys) {
      const sorted = this.sortObjectKeys(parsed);
      return JSON.stringify(sorted, null, indent);
    }

    return JSON.stringify(parsed, null, indent);
  }

  private sortObjectKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj: any = {};
      
      for (const key of sortedKeys) {
        sortedObj[key] = this.sortObjectKeys(obj[key]);
      }
      
      return sortedObj;
    }
    
    return obj;
  }
}

class Base64EncoderTool {
  async process(input: string, options: any = {}): Promise<string> {
    const { operation = 'encode', urlSafe = false } = options;
    
    if (!input.trim()) {
      return '';
    }

    if (operation === 'encode') {
      return this.encode(input, urlSafe);
    } else {
      return this.decode(input, urlSafe);
    }
  }

  private encode(input: string, urlSafe: boolean): string {
    const encoded = Buffer.from(input, 'utf8').toString('base64');
    
    if (urlSafe) {
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    
    return encoded;
  }

  private decode(input: string, urlSafe: boolean): string {
    let cleaned = input.replace(/\s/g, '');
    
    if (urlSafe) {
      cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
      while (cleaned.length % 4) {
        cleaned += '=';
      }
    }
    
    return Buffer.from(cleaned, 'base64').toString('utf8');
  }
}

class PasswordGeneratorTool {
  async process(_input: string, options: any = {}): Promise<string> {
    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = false,
      excludeAmbiguous = false,
    } = options;

    const passwordLength = Math.max(8, Math.min(128, parseInt(length) || 12));

    let charset = '';
    
    if (includeUppercase) {
      charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (includeLowercase) {
      charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    
    if (includeNumbers) {
      charset += '0123456789';
    }
    
    if (includeSymbols) {
      charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    if (excludeSimilar) {
      charset = charset.replace(/[0OIl1]/g, '');
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\~,;.<>]/g, '');
    }

    if (charset.length === 0) {
      throw new Error('至少需要选择一种字符类型');
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }
}

class TimestampConverterTool {
  async process(input: string, options: any = {}): Promise<string> {
    const { operation = 'toDate', format = 'iso' } = options;
    
    if (!input.trim()) {
      return '';
    }

    if (operation === 'toDate') {
      const timestamp = parseInt(input);
      if (isNaN(timestamp)) {
        throw new Error('无效的时间戳');
      }
      
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('无效的时间戳');
      }
      
      if (format === 'iso') {
        return date.toISOString();
      } else if (format === 'local') {
        return date.toLocaleString('zh-CN');
      } else {
        return date.toString();
      }
    } else {
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期格式');
      }
      
      return date.getTime().toString();
    }
  }
}

class QrCodeGeneratorTool {
  async process(input: string, options: any = {}): Promise<string> {
    const { size = 200 } = options;
    
    if (!input.trim()) {
      throw new Error('输入内容不能为空');
    }

    // 这里应该使用 qrcode 库生成二维码
    // 为了简化，返回一个占位符
    return `QR Code for: ${input} (${size}x${size})`;
  }
}

// 工具注册表
const toolRegistry = new Map<string, any>([
  ['json-formatter', new JsonFormatterTool()],
  ['base64-encoder', new Base64EncoderTool()],
  ['password-generator', new PasswordGeneratorTool()],
  ['timestamp-converter', new TimestampConverterTool()],
  ['qr-code-generator', new QrCodeGeneratorTool()],
]);

// 工具数据
const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: '格式化 JSON 数据，支持压缩和美化',
    category: 'code',
    icon: 'code',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'base64-encoder',
    name: 'Base64 编码器',
    description: 'Base64 编码和解码工具',
    category: 'data',
    icon: 'lock',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全的随机密码',
    category: 'security',
    icon: 'key',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换器',
    description: '时间戳与日期格式相互转换',
    category: 'data',
    icon: 'clock',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'qr-code-generator',
    name: '二维码生成器',
    description: '生成二维码图片',
    category: 'utility',
    icon: 'qr-code',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class ToolService {
  async getAllTools(): Promise<Tool[]> {
    return tools.filter(tool => tool.isActive);
  }

  async getToolById(id: string): Promise<Tool | null> {
    return tools.find(tool => tool.id === id && tool.isActive) || null;
  }

  async getToolsByCategory(category: ToolCategory): Promise<Tool[]> {
    return tools.filter(tool => tool.category === category && tool.isActive);
  }

  async searchTools(query: string): Promise<Tool[]> {
    const lowercaseQuery = query.toLowerCase();
    return tools.filter(tool => 
      tool.isActive && (
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async processTool(request: ToolProcessRequest): Promise<ToolProcessResponse> {
    const startTime = Date.now();
    
    try {
      const tool = toolRegistry.get(request.toolId);
      if (!tool) {
        throw new Error(`工具 ${request.toolId} 不存在`);
      }

      const result = await tool.process(request.input, request.options || {});
      const processingTime = Date.now() - startTime;

      // 记录性能日志
      performanceLogger.info('Tool processed', {
        toolId: request.toolId,
        processingTime,
        inputLength: request.input.length,
        outputLength: result.length,
      });

      return {
        success: true,
        result,
        processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : '处理失败';

      logger.error('Tool processing failed', {
        toolId: request.toolId,
        error: errorMessage,
        processingTime,
      });

      return {
        success: false,
        error: errorMessage,
        processingTime,
      };
    }
  }

  async getPopularTools(limit: number = 10): Promise<Tool[]> {
    // 这里应该从数据库获取使用统计
    // 暂时返回前几个工具
    return tools.slice(0, limit);
  }

  async getRecentTools(limit: number = 10): Promise<Tool[]> {
    // 这里应该从数据库获取最近使用的工具
    // 暂时返回前几个工具
    return tools.slice(0, limit);
  }

  async getCategories(): Promise<string[]> {
    const categories = [...new Set(tools.map(tool => tool.category))];
    return categories;
  }
}

export const toolService = new ToolService();
