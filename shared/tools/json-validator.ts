import { BaseTool } from './base';

export class JSONValidatorTool extends BaseTool {
  id = 'json-validator';
  name = 'JSON 验证器';
  description = '验证 JSON 格式是否正确，并提供详细的错误信息。';
  category = 'code';
  icon = 'CheckCircle';
  slug = 'json-validator';

  options = [
    {
      key: 'format',
      label: '格式化输出',
      type: 'boolean',
      defaultValue: true,
      description: '是否格式化验证后的 JSON'
    },
    {
      key: 'strict',
      label: '严格模式',
      type: 'boolean',
      defaultValue: false,
      description: '是否启用严格模式（不允许重复键）'
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { format = true, strict = false } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          valid: false,
          error: '输入为空',
          message: '请输入要验证的 JSON 内容'
        }, null, 2);
      }

      // 尝试解析 JSON
      let parsed: any;
      try {
        parsed = JSON.parse(input);
      } catch (error: any) {
        return JSON.stringify({
          valid: false,
          error: 'JSON 解析错误',
          message: error.message,
          position: this.getErrorPosition(input, error.message)
        }, null, 2);
      }

      // 严格模式检查
      if (strict) {
        const duplicateKeys = this.findDuplicateKeys(input);
        if (duplicateKeys.length > 0) {
          return JSON.stringify({
            valid: false,
            error: '严格模式验证失败',
            message: '发现重复的键',
            duplicateKeys: duplicateKeys
          }, null, 2);
        }
      }

      // 验证成功
      const result = {
        valid: true,
        message: 'JSON 格式正确',
        type: this.getJSONType(parsed),
        size: {
          characters: input.length,
          lines: input.split('\n').length,
          keys: this.countKeys(parsed)
        }
      };

      if (format) {
        result['formatted'] = JSON.stringify(parsed, null, 2);
      }

      return JSON.stringify(result, null, 2);
    } catch (error: any) {
      throw new Error(`JSON 验证失败: ${error.message}`);
    }
  }

  private getErrorPosition(input: string, errorMessage: string): any {
    const match = errorMessage.match(/position (\d+)/);
    if (match) {
      const position = parseInt(match[1]);
      const lines = input.substring(0, position).split('\n');
      return {
        position: position,
        line: lines.length,
        column: lines[lines.length - 1].length + 1
      };
    }
    return null;
  }

  private findDuplicateKeys(input: string): string[] {
    const duplicates: string[] = [];
    const keyRegex = /"([^"]+)"\s*:/g;
    const keys: string[] = [];
    let match;

    while ((match = keyRegex.exec(input)) !== null) {
      const key = match[1];
      if (keys.includes(key) && !duplicates.includes(key)) {
        duplicates.push(key);
      }
      keys.push(key);
    }

    return duplicates;
  }

  private getJSONType(obj: any): string {
    if (obj === null) return 'null';
    if (Array.isArray(obj)) return 'array';
    return typeof obj;
  }

  private countKeys(obj: any): number {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) {
      return obj.reduce((count, item) => count + this.countKeys(item), 0);
    }
    return Object.keys(obj).length + Object.values(obj).reduce((count, value) => count + this.countKeys(value), 0);
  }

  validate(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }
}
