import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class SQLFormatterTool extends BaseTool {
  id = 'sql-formatter';
  name = 'SQL 格式化器';
  description = '美化和格式化 SQL 代码，支持多种数据库语法';
  category: ToolCategory = 'code';
  icon = 'database';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      indentSize = 2,
      keywordCase = 'upper',
      indentType = 'space',
      alignColumns = true
    } = options;

    try {
      return this.formatSQL(input, {
        indentSize,
        keywordCase,
        indentType,
        alignColumns
      });
    } catch (error) {
      throw new Error(`SQL 格式化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    // 简单的 SQL 验证
    return input.trim().length > 0;
  }

  private formatSQL(sql: string, options: any): string {
    let formatted = sql;
    
    // SQL 关键字列表
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
      'ALTER', 'TABLE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER',
      'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER',
      'HAVING', 'UNION', 'ALL', 'DISTINCT', 'AS', 'AND', 'OR', 'NOT', 'IN',
      'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'TRUE', 'FALSE'
    ];
    
    // 转换为指定大小写
    if (options.keywordCase === 'upper') {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });
    } else if (options.keywordCase === 'lower') {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword.toLowerCase());
      });
    }
    
    // 添加适当的缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = options.indentType === 'tab' ? '\t' : ' '.repeat(options.indentSize);
    
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // 减少缩进级别
      if (trimmed.match(/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|UNION)/i)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = indent.repeat(indentLevel) + trimmed;
      
      // 增加缩进级别
      if (trimmed.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i)) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    formatted = processedLines.join('\n');
    
    return formatted;
  }
}
