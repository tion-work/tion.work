import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class CSVConverterTool extends BaseTool {
  id = 'csv-converter';
  name = 'CSV 转换器';
  description = 'JSON 与 CSV 格式相互转换';
  category: ToolCategory = 'data';
  icon = 'file-text';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      direction = 'json-to-csv',
      delimiter = ',',
      includeHeaders = true,
      quoteChar = '"'
    } = options;

    try {
      if (direction === 'json-to-csv') {
        return this.jsonToCsv(input, { delimiter, includeHeaders, quoteChar });
      } else {
        return this.csvToJson(input, { delimiter, quoteChar });
      }
    } catch (error) {
      throw new Error(`CSV 转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    try {
      if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
        JSON.parse(input);
        return true;
      } else {
        // 简单的 CSV 验证
        return input.trim().length > 0;
      }
    } catch {
      return false;
    }
  }

  private jsonToCsv(json: string, options: any): string {
    const data = JSON.parse(json);
    const array = Array.isArray(data) ? data : [data];
    
    if (array.length === 0) return '';
    
    const headers = Object.keys(array[0]);
    let csv = '';
    
    // 添加表头
    if (options.includeHeaders) {
      csv += headers.map(header => this.escapeCsvValue(header, options.quoteChar)).join(options.delimiter) + '\n';
    }
    
    // 添加数据行
    array.forEach(row => {
      const values = headers.map(header => this.escapeCsvValue(row[header] || '', options.quoteChar));
      csv += values.join(options.delimiter) + '\n';
    });
    
    return csv;
  }

  private csvToJson(csv: string, options: any): string {
    const lines = csv.trim().split('\n');
    if (lines.length === 0) return '[]';
    
    const headers = lines[0].split(options.delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i], options.delimiter, options.quoteChar);
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    return JSON.stringify(data, null, 2);
  }

  private escapeCsvValue(value: any, quoteChar: string): string {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `${quoteChar}${str.replace(/"/g, '""')}${quoteChar}`;
    }
    return str;
  }

  private parseCsvLine(line: string, delimiter: string, quoteChar: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === quoteChar) {
        if (inQuotes && line[i + 1] === quoteChar) {
          current += quoteChar;
          i++; // 跳过下一个引号
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }
}
