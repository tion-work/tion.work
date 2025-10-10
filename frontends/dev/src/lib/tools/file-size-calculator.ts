import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class FileSizeCalculatorTool extends BaseTool {
  id = 'file-size-calculator';
  name = '文件大小计算器';
  description = '计算文件大小，支持多种单位转换和格式化显示。';
  category: ToolCategory = 'utility';
  icon = 'HardDrive';
  slug = 'file-size-calculator';

  options = [
    {
      key: 'inputUnit',
      label: '输入单位',
      type: 'select',
      defaultValue: 'bytes',
      description: '选择输入数据的单位',
      options: [
        { value: 'bytes', label: '字节 (Bytes)' },
        { value: 'kb', label: '千字节 (KB)' },
        { value: 'mb', label: '兆字节 (MB)' },
        { value: 'gb', label: '吉字节 (GB)' },
        { value: 'tb', label: '太字节 (TB)' }
      ]
    },
    {
      key: 'outputFormat',
      label: '输出格式',
      type: 'select',
      defaultValue: 'all',
      description: '选择输出格式',
      options: [
        { value: 'all', label: '所有单位' },
        { value: 'human', label: '人类可读格式' },
        { value: 'bytes', label: '仅字节' },
        { value: 'kb', label: '仅千字节' },
        { value: 'mb', label: '仅兆字节' },
        { value: 'gb', label: '仅吉字节' }
      ]
    },
    {
      key: 'precision',
      label: '小数精度',
      type: 'number',
      defaultValue: 2,
      description: '保留的小数位数（0-10）'
    }
  ];

  private units = {
    bytes: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
    tb: 1024 * 1024 * 1024 * 1024
  };

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { inputUnit = 'bytes', outputFormat = 'all', precision = 2 } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          error: '输入为空',
          message: '请输入要计算的文件大小数值'
        }, null, 2);
      }

      const size = parseFloat(input.trim());
      if (isNaN(size) || size < 0) {
        throw new Error('请输入有效的数值');
      }

      const bytes = size * this.units[inputUnit as keyof typeof this.units];
      const result = this.calculateAllUnits(bytes, precision);

      switch (outputFormat) {
        case 'all':
          return this.formatAllUnits(result, precision);
        case 'human':
          return this.formatHumanReadable(result, precision);
        case 'bytes':
          return result.bytes.toString();
        case 'kb':
          return result.kb.toFixed(precision);
        case 'mb':
          return result.mb.toFixed(precision);
        case 'gb':
          return result.gb.toFixed(precision);
        default:
          return this.formatAllUnits(result, precision);
      }
    } catch (error: any) {
      throw new Error(`文件大小计算失败: ${error.message}`);
    }
  }

  private calculateAllUnits(bytes: number, precision: number): any {
    return {
      bytes: Math.round(bytes),
      kb: parseFloat((bytes / this.units.kb).toFixed(precision)),
      mb: parseFloat((bytes / this.units.mb).toFixed(precision)),
      gb: parseFloat((bytes / this.units.gb).toFixed(precision)),
      tb: parseFloat((bytes / this.units.tb).toFixed(precision))
    };
  }

  private formatAllUnits(result: any, precision: number): string {
    return `字节: ${result.bytes.toLocaleString()}
千字节 (KB): ${result.kb.toFixed(precision)}
兆字节 (MB): ${result.mb.toFixed(precision)}
吉字节 (GB): ${result.gb.toFixed(precision)}
太字节 (TB): ${result.tb.toFixed(precision)}`;
  }

  private formatHumanReadable(result: any, precision: number): string {
    if (result.tb >= 1) {
      return `${result.tb.toFixed(precision)} TB`;
    } else if (result.gb >= 1) {
      return `${result.gb.toFixed(precision)} GB`;
    } else if (result.mb >= 1) {
      return `${result.mb.toFixed(precision)} MB`;
    } else if (result.kb >= 1) {
      return `${result.kb.toFixed(precision)} KB`;
    } else {
      return `${result.bytes} 字节`;
    }
  }

  validate(input: string): boolean {
    const num = parseFloat(input.trim());
    return !isNaN(num) && num >= 0;
  }
}
