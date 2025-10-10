import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class TextDiffTool extends BaseTool {
  id = 'text-diff';
  name = '文本对比工具';
  description = '比较两个文本的差异，支持行级和字符级对比';
  category: ToolCategory = 'text';
  icon = 'git-compare';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      text1 = '',
      text2 = '',
      mode = 'line',
      ignoreWhitespace = false,
      caseSensitive = true
    } = options;

    try {
      return this.compareTexts(text1, text2, { mode, ignoreWhitespace, caseSensitive });
    } catch (error) {
      throw new Error(`文本对比失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    return input.trim().length > 0;
  }

  private compareTexts(text1: string, text2: string, options: any): string {
    const { mode, ignoreWhitespace, caseSensitive } = options;
    
    let processedText1 = text1;
    let processedText2 = text2;
    
    // 处理选项
    if (!caseSensitive) {
      processedText1 = processedText1.toLowerCase();
      processedText2 = processedText2.toLowerCase();
    }
    
    if (ignoreWhitespace) {
      processedText1 = processedText1.replace(/\s+/g, ' ').trim();
      processedText2 = processedText2.replace(/\s+/g, ' ').trim();
    }
    
    const result: any = {
      input: {
        text1: text1,
        text2: text2,
        length1: text1.length,
        length2: text2.length
      },
      options: {
        mode: mode,
        ignoreWhitespace: ignoreWhitespace,
        caseSensitive: caseSensitive
      },
      comparison: {
        identical: processedText1 === processedText2,
        similarity: this.calculateSimilarity(processedText1, processedText2)
      }
    };
    
    if (mode === 'line') {
      result.diff = this.lineDiff(text1, text2, options);
    } else {
      result.diff = this.characterDiff(processedText1, processedText2);
    }
    
    return JSON.stringify(result, null, 2);
  }

  private lineDiff(text1: string, text2: string, options: any): any {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const diff: any[] = [];
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diff.push({
          type: 'equal',
          line: i + 1,
          content: line1
        });
      } else if (!line1) {
        diff.push({
          type: 'added',
          line: i + 1,
          content: line2
        });
      } else if (!line2) {
        diff.push({
          type: 'removed',
          line: i + 1,
          content: line1
        });
      } else {
        diff.push({
          type: 'modified',
          line: i + 1,
          oldContent: line1,
          newContent: line2
        });
      }
    }
    
    return {
      lines: diff,
      summary: {
        added: diff.filter(d => d.type === 'added').length,
        removed: diff.filter(d => d.type === 'removed').length,
        modified: diff.filter(d => d.type === 'modified').length,
        equal: diff.filter(d => d.type === 'equal').length
      }
    };
  }

  private characterDiff(text1: string, text2: string): any {
    const diff: any[] = [];
    let i = 0, j = 0;
    
    while (i < text1.length || j < text2.length) {
      if (i >= text1.length) {
        diff.push({
          type: 'added',
          content: text2[j],
          position: j
        });
        j++;
      } else if (j >= text2.length) {
        diff.push({
          type: 'removed',
          content: text1[i],
          position: i
        });
        i++;
      } else if (text1[i] === text2[j]) {
        diff.push({
          type: 'equal',
          content: text1[i],
          position: i
        });
        i++;
        j++;
      } else {
        // 查找下一个匹配的字符
        let found = false;
        for (let k = j + 1; k < Math.min(j + 10, text2.length); k++) {
          if (text1[i] === text2[k]) {
            // 添加中间的字符
            for (let l = j; l < k; l++) {
              diff.push({
                type: 'added',
                content: text2[l],
                position: l
              });
            }
            j = k;
            found = true;
            break;
          }
        }
        
        if (!found) {
          diff.push({
            type: 'removed',
            content: text1[i],
            position: i
          });
          i++;
        }
      }
    }
    
    return {
      characters: diff,
      summary: {
        added: diff.filter(d => d.type === 'added').length,
        removed: diff.filter(d => d.type === 'removed').length,
        equal: diff.filter(d => d.type === 'equal').length
      }
    };
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}
