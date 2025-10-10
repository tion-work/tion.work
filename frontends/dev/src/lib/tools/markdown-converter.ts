import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class MarkdownConverterTool extends BaseTool {
  id = 'markdown-converter';
  name = 'Markdown 转换器';
  description = '将 Markdown 代码转换为 HTML，支持 GitHub 风格扩展和数学公式';
  category: ToolCategory = 'text';
  icon = 'file-text';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      enableGfm = true,
      enableTables = true,
      enableStrikethrough = true,
      enableTaskLists = true,
      enableFootnotes = true,
      enableMath = true,
      enableCodeHighlight = true,
      sanitize = false,
      breaks = false
    } = options;

    try {
      return this.convertMarkdown(input, {
        enableGfm,
        enableTables,
        enableStrikethrough,
        enableTaskLists,
        enableFootnotes,
        enableMath,
        enableCodeHighlight,
        sanitize,
        breaks
      });
    } catch (error) {
      throw new Error(`Markdown 转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }

  private convertMarkdown(markdown: string, options: any): string {
    let html = markdown;
    
    // 处理标题
    html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
      const level = hashes.length;
      return `<h${level}>${text.trim()}</h${level}>`;
    });
    
    // 处理粗体和斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</gtrong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理删除线
    if (options.enableStrikethrough) {
      html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    }
    
    // 处理代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 处理代码块
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || '';
      return `<pre><code class="language-${language}">${code.trim()}</code></pre>`;
    });
    
    // 处理行内代码块
    html = html.replace(/```\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // 处理图片
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // 处理列表
    html = html.replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
    
    // 处理有序列表
    html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ol>$1</ol>');
    
    // 处理任务列表
    if (options.enableTaskLists) {
      html = html.replace(/^[\s]*[-*+]\s+\[([ x])\]\s+(.+)$/gm, (match, checked, text) => {
        const isChecked = checked === 'x';
        return `<li><input type="checkbox" ${isChecked ? 'checked' : ''} disabled> ${text}</li>`;
      });
    }
    
    // 处理表格
    if (options.enableTables) {
      html = this.convertTables(html);
    }
    
    // 处理引用
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // 处理水平线
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    
    // 处理换行
    if (options.breaks) {
      html = html.replace(/\n/g, '<br>');
    } else {
      html = html.replace(/\n\n/g, '</p><p>');
      html = '<p>' + html + '</p>';
    }
    
    // 处理数学公式
    if (options.enableMath) {
      // 行内数学公式
      html = html.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</gpan>');
      
      // 块级数学公式
      html = html.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$1</div>');
    }
    
    // 处理脚注
    if (options.enableFootnotes) {
      html = html.replace(/\[\^(\d+)\]/g, '<sup><a href="#fn$1" id="ref$1">$1</a></gup>');
      html = html.replace(/\[\^(\d+)\]:\s*(.+)$/gm, '<div id="fn$1">$2 <a href="#ref$1">↩</a></div>');
    }
    
    return html;
  }
  
  private convertTables(markdown: string): string {
    const lines = markdown.split('\n');
    let inTable = false;
    let tableRows: string[] = [];
    let result: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查是否是表格行
      if (line.includes('|') && line.trim().length > 0) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
      } else {
        if (inTable && tableRows.length > 0) {
          result.push(this.convertTableRows(tableRows));
          tableRows = [];
          inTable = false;
        }
        result.push(line);
      }
    }
    
    // 处理最后的表格
    if (inTable && tableRows.length > 0) {
      result.push(this.convertTableRows(tableRows));
    }
    
    return result.join('\n');
  }
  
  private convertTableRows(rows: string[]): string {
    if (rows.length < 2) return rows.join('\n');
    
    const headerRow = rows[0];
    const separatorRow = rows[1];
    const dataRows = rows.slice(2);
    
    // 检查分隔符行
    if (!separatorRow.includes('---')) {
      return rows.join('\n');
    }
    
    const headerCells = headerRow.split('|').map(cell => cell.trim()).filter(cell => cell);
    const headerHtml = `<thead><tr>${headerCells.map(cell => `<th>${cell}</th>`).join('')}</tr></thead>`;
    
    const bodyRows = dataRows.map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
    }).join('');
    
    return `<table class="table">${headerHtml}<tbody>${bodyRows}</tbody></table>`;
  }
}
