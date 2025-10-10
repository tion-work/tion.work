import { BaseTool } from './base';

export class XMLFormatterTool extends BaseTool {
  id = 'xml-formatter';
  name = 'XML 格式化器';
  description = '美化和格式化 XML 代码，支持缩进和验证';
  category = 'code';
  icon = 'code';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      indentSize = 2,
      indentType = 'space',
      preserveComments = true,
      sortAttributes = false
    } = options;

    try {
      return this.formatXML(input, {
        indentSize,
        indentType,
        preserveComments,
        sortAttributes
      });
    } catch (error) {
      throw new Error(`XML 格式化失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    try {
      // 简单的 XML 验证
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      return !doc.getElementsByTagName('parsererror').length;
    } catch {
      return false;
    }
  }

  private formatXML(xml: string, options: any): string {
    let formatted = xml;
    
    // 移除多余的空行
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 添加适当的缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = options.indentType === 'tab' ? '\t' : ' '.repeat(options.indentSize);
    
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      // 减少缩进级别
      if (trimmed.startsWith('</') || trimmed.startsWith('<?')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = indent.repeat(indentLevel) + trimmed;
      
      // 增加缩进级别
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && 
          !trimmed.startsWith('<?') && !trimmed.startsWith('<!--')) {
        indentLevel++;
      }
      
      return indentedLine;
    });
    
    formatted = processedLines.join('\n');
    
    return formatted;
  }
}
