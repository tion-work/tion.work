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
