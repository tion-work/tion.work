import { BaseTool } from './base';
import { ToolCategory } from '@/types';

export class TimestampConverterTool extends BaseTool {
  id = 'timestamp-converter';
  name = '时间戳转换器';
  description = '时间戳与日期格式相互转换';
  category: ToolCategory = 'data';
  icon = 'clock';
  options = [
    {
      key: 'operation',
      label: '操作',
      type: 'select' as const,
      defaultValue: 'toDate',
      options: [
        { label: '时间戳转日期', value: 'toDate' },
        { label: '日期转时间戳', value: 'toTimestamp' },
      ],
      description: '选择转换方向',
    },
    {
      key: 'format',
      label: '格式',
      type: 'select' as const,
      defaultValue: 'iso',
      options: [
        { label: 'ISO 8601', value: 'iso' },
        { label: '本地时间', value: 'local' },
        { label: 'UTC 时间', value: 'utc' },
        { label: '自定义格式', value: 'custom' },
      ],
      description: '选择输出格式',
    },
    {
      key: 'customFormat',
      label: '自定义格式',
      type: 'string' as const,
      defaultValue: 'YYYY-MM-DD HH:mm:ss',
      description: '自定义日期格式 (如: YYYY-MM-DD HH:mm:ss)',
    },
  ];

  async process(input: string, options: Record<string, any> = {}): Promise<string> {
    try {
      const { operation = 'toDate', format = 'iso', customFormat = 'YYYY-MM-DD HH:mm:ss' } = options;
      
      if (!input.trim()) {
        return '';
      }

      if (operation === 'toDate') {
        return this.timestampToDate(input, format, customFormat);
      } else {
        return this.dateToTimestamp(input);
      }
    } catch (error) {
      throw new Error(`时间戳转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }
    
    // 检查是否为数字（时间戳）
    if (/^\d+$/.test(input.trim())) {
      const timestamp = parseInt(input.trim());
      const date = new Date(timestamp);
      return !isNaN(date.getTime());
    }
    
    // 检查是否为有效日期
    const date = new Date(input);
    return !isNaN(date.getTime());
  }

  private timestampToDate(input: string, format: string, customFormat: string): string {
    const timestamp = parseInt(input.trim());
    
    if (isNaN(timestamp)) {
      throw new Error('无效的时间戳');
    }
    
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的时间戳');
    }
    
    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'local':
        return date.toLocaleString('zh-CN');
      case 'utc':
        return date.toUTCString();
      case 'custom':
        return this.formatDate(date, customFormat);
      default:
        return date.toString();
    }
  }

  private dateToTimestamp(input: string): string {
    const date = new Date(input.trim());
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式');
    }
    
    return date.getTime().toString();
  }

  private formatDate(date: Date, format: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}
