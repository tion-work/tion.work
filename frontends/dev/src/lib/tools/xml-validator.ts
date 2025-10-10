import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class XMLValidatorTool extends BaseTool {
  id = 'xml-validator';
  name = 'XML 验证器';
  description = '验证 XML 格式是否正确，检查语法和结构。';
  category: ToolCategory = 'code';
  icon = 'CheckCircle';
  slug = 'xml-validator';

  options = [
    {
      key: 'format',
      label: '格式化输出',
      type: 'boolean',
      defaultValue: true,
      description: '是否格式化验证后的 XML'
    },
    {
      key: 'checkWellFormed',
      label: '检查格式良好性',
      type: 'boolean',
      defaultValue: true,
      description: '是否检查 XML 格式是否良好'
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { format = true, checkWellFormed = true } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          valid: false,
          error: '输入为空',
          message: '请输入要验证的 XML 内容'
        }, null, 2);
      }

      const result: any = {
        valid: true,
        message: 'XML 格式正确',
        statistics: this.getXMLStatistics(input)
      };

      if (checkWellFormed) {
        const validation = this.validateXML(input);
        if (!validation.valid) {
          result.valid = false;
          result.error = validation.error;
          result.message = validation.message;
          result.position = validation.position;
          return JSON.stringify(result, null, 2);
        }
      }

      if (format) {
        result.formatted = this.formatXML(input);
      }

      return JSON.stringify(result, null, 2);
    } catch (error: any) {
      throw new Error(`XML 验证失败: ${error.message}`);
    }
  }

  private validateXML(xml: string): any {
    // 基本 XML 格式检查
    const errors: string[] = [];
    const position: any = {};

    // 检查是否有根元素
    const rootMatch = xml.match(/<([^\/\s>]+)[^>]*>/);
    if (!rootMatch) {
      return {
        valid: false,
        error: '缺少根元素',
        message: 'XML 必须有一个根元素'
      };
    }

    // 检查标签匹配
    const tagStack: string[] = [];
    const tagRegex = /<\/?([^\/\s>]+)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(xml)) !== null) {
      const fullTag = match[0];
      const tagName = match[1];
      const isClosingTag = fullTag.startsWith('</');

      if (isClosingTag) {
        if (tagStack.length === 0) {
          errors.push(`意外的闭合标签: </${tagName}>`);
          position.line = this.getLineNumber(xml, match.index);
          position.column = match.index - xml.lastIndexOf('\n', match.index);
          break;
        }

        const lastTag = tagStack.pop();
        if (lastTag !== tagName) {
          errors.push(`标签不匹配: 期望 </${lastTag}>，但找到 </${tagName}>`);
          position.line = this.getLineNumber(xml, match.index);
          position.column = match.index - xml.lastIndexOf('\n', match.index);
          break;
        }
      } else if (!fullTag.endsWith('/>')) {
        // 自闭合标签不推入栈
        tagStack.push(tagName);
      }
    }

    if (tagStack.length > 0) {
      errors.push(`未闭合的标签: <${tagStack[tagStack.length - 1]}>`);
    }

    // 检查特殊字符
    if (xml.includes('&') && !xml.includes('&amp;') && !xml.includes('&lt;') && !xml.includes('&gt;') && !xml.includes('&quot;') && !xml.includes('&apos;')) {
      const ampIndex = xml.indexOf('&');
      if (ampIndex !== -1) {
        errors.push('未转义的特殊字符: &');
        position.line = this.getLineNumber(xml, ampIndex);
        position.column = ampIndex - xml.lastIndexOf('\n', ampIndex);
      }
    }

    return {
      valid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : null,
      message: errors.length > 0 ? errors.join('; ') : 'XML 格式正确',
      position: errors.length > 0 ? position : null
    };
  }

  private getLineNumber(text: string, index: number): number {
    return text.substring(0, index).split('\n').length;
  }

  private getXMLStatistics(xml: string): any {
    const tagRegex = /<\/?([^\/\s>]+)[^>]*>/g;
    const tags: string[] = [];
    let match;

    while ((match = tagRegex.exec(xml)) !== null) {
      const tagName = match[1];
      if (!tags.includes(tagName)) {
        tags.push(tagName);
      }
    }

    return {
      characters: xml.length,
      lines: xml.split('\n').length,
      tags: tags.length,
      uniqueTags: tags
    };
  }

  private formatXML(xml: string): string {
    // 简单的 XML 格式化
    let formatted = xml;
    
    // 在标签后添加换行
    formatted = formatted.replace(/>\s*</g, '>\n<');
    
    // 添加缩进
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = '  ';
    
    return lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const result = indent.repeat(indentLevel) + trimmed;
      
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indentLevel++;
      }
      
      return result;
    }).join('\n');
  }

  validate(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }
}
