import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class PasswordGeneratorTool extends BaseTool {
  id = 'password-generator';
  name = '密码生成器';
  description = '生成安全的随机密码';
  category: ToolCategory = 'security';
  icon = 'key';
  options = [
    {
      key: 'length',
      label: '长度',
      type: 'number' as const,
      defaultValue: 12,
      description: '密码长度 (8-128)',
    },
    {
      key: 'includeUppercase',
      label: '大写字母',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含大写字母 A-Z',
    },
    {
      key: 'includeLowercase',
      label: '小写字母',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含小写字母 a-z',
    },
    {
      key: 'includeNumbers',
      label: '数字',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含数字 0-9',
    },
    {
      key: 'includeSymbols',
      label: '特殊符号',
      type: 'boolean' as const,
      defaultValue: true,
      description: '包含特殊符号 !@#$%^&*',
    },
    {
      key: 'excludeSimilar',
      label: '排除相似字符',
      type: 'boolean' as const,
      defaultValue: false,
      description: '排除容易混淆的字符 (0, O, l, I)',
    },
    {
      key: 'excludeAmbiguous',
      label: '排除歧义字符',
      type: 'boolean' as const,
      defaultValue: false,
      description: '排除可能引起歧义的字符',
    },
  ];

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    try {
      const {
        length = 12,
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSymbols = true,
        excludeSimilar = false,
        excludeAmbiguous = false,
      } = options;

      // 验证长度
      const passwordLength = Math.max(8, Math.min(128, parseInt(length) || 12));

      // 构建字符集
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

      // 应用排除规则
      if (excludeSimilar) {
        charset = charset.replace(/[0OIl1]/g, '');
      }
      
      if (excludeAmbiguous) {
        charset = charset.replace(/[{}[\]()\/\\~,;.<>]/g, '');
      }

      if (charset.length === 0) {
        throw new Error('至少需要选择一种字符类型');
      }

      // 生成密码
      let password = '';
      for (let i = 0; i < passwordLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      return password;
    } catch (error) {
      throw new Error(`密码生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    // 密码生成器不需要验证输入
    return true;
  }
}
