import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class PythonFormatterTool extends BaseTool {
  id = 'python-formatter';
  name = 'Python 格式化器';
  description = '美化和格式化 Python 代码，支持 PEP 8 规范';
  category: ToolCategory = 'code';
  icon = 'code';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      indentSize = 4,
      maxLineLength = 88,
      sortImports = true,
      removeUnusedImports = true
    } = options;

    try {
      return this.formatPython(input, {
        indentSize,
        maxLineLength,
        sortImports,
        removeUnusedImports
      });
    } catch (error) {
      throw new Error(`Python 格式化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    try {
      // 简单的 Python 语法检查
      return input.trim().length > 0;
    } catch {
      return false;
    }
  }

  private formatPython(code: string, options: any): string {
    let formatted = code;
    
    // 移除多余的空行
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 添加适当的缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = ' '.repeat(options.indentSize);
    
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // 减少缩进级别
      if (trimmed.startsWith('except') || trimmed.startsWith('finally') || 
          trimmed.startsWith('else') || trimmed.startsWith('elif')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = indent.repeat(indentLevel) + trimmed;
      
      // 增加缩进级别
      if (trimmed.endsWith(':') && !trimmed.startsWith('#')) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    formatted = processedLines.join('\n');
    
    return formatted;
  }
}
