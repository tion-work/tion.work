import { BaseTool } from './base';

export class TimeCalculatorTool extends BaseTool {
  id = 'time-calculator';
  name = '时间计算器';
  description = '进行时间相关的计算，包括时间差、时间加减等操作。';
  category = 'utility';
  icon = 'Clock';
  slug = 'time-calculator';

  options = [
    {
      key: 'operation',
      label: '计算类型',
      type: 'select',
      defaultValue: 'difference',
      description: '选择要进行的计算类型',
      options: [
        { value: 'difference', label: '时间差计算' },
        { value: 'add', label: '时间加法' },
        { value: 'subtract', label: '时间减法' },
        { value: 'convert', label: '时间单位转换' }
      ]
    },
    {
      key: 'format',
      label: '输出格式',
      type: 'select',
      defaultValue: 'human',
      description: '选择输出格式',
      options: [
        { value: 'human', label: '人类可读格式' },
        { value: 'seconds', label: '秒数' },
        { value: 'minutes', label: '分钟数' },
        { value: 'hours', label: '小时数' },
        { value: 'days', label: '天数' }
      ]
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { operation = 'difference', format = 'human' } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          error: '输入为空',
          message: '请输入时间数据'
        }, null, 2);
      }

      switch (operation) {
        case 'difference':
          return this.calculateDifference(input, format);
        case 'add':
          return this.calculateAdd(input, format);
        case 'subtract':
          return this.calculateSubtract(input, format);
        case 'convert':
          return this.convertTime(input, format);
        default:
          return this.calculateDifference(input, format);
      }
    } catch (error: any) {
      throw new Error(`时间计算失败: ${error.message}`);
    }
  }

  private calculateDifference(input: string, format: string): string {
    const lines = input.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('时间差计算需要至少两个时间点');
    }

    const time1 = this.parseTime(lines[0]);
    const time2 = this.parseTime(lines[1]);
    
    const diffMs = Math.abs(time2.getTime() - time1.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    
    return this.formatTimeDifference(diffSeconds, format);
  }

  private calculateAdd(input: string, format: string): string {
    const lines = input.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('时间加法需要基础时间和要添加的时间');
    }

    const baseTime = this.parseTime(lines[0]);
    const addTime = this.parseDuration(lines[1]);
    
    const resultTime = new Date(baseTime.getTime() + addTime);
    
    return this.formatTimeResult(resultTime, format);
  }

  private calculateSubtract(input: string, format: string): string {
    const lines = input.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('时间减法需要基础时间和要减去的时间');
    }

    const baseTime = this.parseTime(lines[0]);
    const subtractTime = this.parseDuration(lines[1]);
    
    const resultTime = new Date(baseTime.getTime() - subtractTime);
    
    return this.formatTimeResult(resultTime, format);
  }

  private convertTime(input: string, format: string): string {
    const time = this.parseTime(input);
    const totalSeconds = Math.floor(time.getTime() / 1000);
    
    return this.formatTimeDifference(totalSeconds, format);
  }

  private parseTime(timeStr: string): Date {
    // 支持多种时间格式
    const formats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, // YYYY-MM-DD HH:mm:ss
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/, // MM/DD/YYYY HH:mm:ss
      /^\d{1,2}:\d{2}:\d{2}$/, // HH:mm:ss
      /^\d{1,2}:\d{2}$/, // HH:mm
    ];

    let date: Date;
    
    // 尝试直接解析
    date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // 尝试不同格式
    for (const format of formats) {
      if (format.test(timeStr)) {
        if (timeStr.includes('/')) {
          // MM/DD/YYYY 格式
          const [month, day, year] = timeStr.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (timeStr.includes('-')) {
          // YYYY-MM-DD 格式
          date = new Date(timeStr);
        } else if (timeStr.includes(':')) {
          // 时间格式，使用今天的日期
          const today = new Date();
          const [hours, minutes, seconds] = timeStr.split(':');
          date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                         parseInt(hours), parseInt(minutes), parseInt(seconds || '0'));
        }
        
        if (date && !isNaN(date.getTime())) {
          return date;
        }
      }
    }

    throw new Error(`无法解析时间格式: ${timeStr}`);
  }

  private parseDuration(durationStr: string): number {
    // 支持格式: "1h 30m", "90m", "5400s", "1d 2h 30m"
    const durationRegex = /(\d+)([dhms])/g;
    let totalMs = 0;
    let match;

    while ((match = durationRegex.exec(durationStr)) !== null) {
      const value = parseInt(match[1]);
      const unit = match[2];
      
      switch (unit) {
        case 'd':
          totalMs += value * 24 * 60 * 60 * 1000;
          break;
        case 'h':
          totalMs += value * 60 * 60 * 1000;
          break;
        case 'm':
          totalMs += value * 60 * 1000;
          break;
        case 's':
          totalMs += value * 1000;
          break;
      }
    }

    if (totalMs === 0) {
      // 如果没有匹配到任何单位，尝试解析为纯数字（秒）
      const num = parseFloat(durationStr);
      if (!isNaN(num)) {
        totalMs = num * 1000;
      } else {
        throw new Error(`无法解析持续时间: ${durationStr}`);
      }
    }

    return totalMs;
  }

  private formatTimeDifference(seconds: number, format: string): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    switch (format) {
      case 'seconds':
        return seconds.toString();
      case 'minutes':
        return (seconds / 60).toFixed(2);
      case 'hours':
        return (seconds / 3600).toFixed(2);
      case 'days':
        return (seconds / 86400).toFixed(2);
      case 'human':
      default:
        const parts = [];
        if (days > 0) parts.push(`${days}天`);
        if (hours > 0) parts.push(`${hours}小时`);
        if (minutes > 0) parts.push(`${minutes}分钟`);
        if (remainingSeconds > 0) parts.push(`${remainingSeconds}秒`);
        
        return parts.length > 0 ? parts.join(' ') : '0秒';
    }
  }

  private formatTimeResult(time: Date, format: string): string {
    switch (format) {
      case 'seconds':
        return Math.floor(time.getTime() / 1000).toString();
      case 'minutes':
        return (time.getTime() / 60000).toFixed(2);
      case 'hours':
        return (time.getTime() / 3600000).toFixed(2);
      case 'days':
        return (time.getTime() / 86400000).toFixed(2);
      case 'human':
      default:
        return time.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
    }
  }

  validate(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }
}
