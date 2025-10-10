import { BaseTool } from './base';

export class RegexTesterTool extends BaseTool {
  id = 'regex-tester';
  name = '正则表达式测试器';
  description = '测试和调试正则表达式，支持多种标志';
  category = 'data';
  icon = 'search';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      pattern = '',
      flags = 'g',
      testText = '',
      replaceText = ''
    } = options;

    try {
      return this.testRegex(input, { pattern, flags, testText, replaceText });
    } catch (error) {
      throw new Error(`正则表达式测试失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    try {
      new RegExp(input);
      return true;
    } catch {
      return false;
    }
  }

  private testRegex(input: string, options: any): string {
    const { pattern, flags, testText, replaceText } = options;
    
    if (!pattern) {
      return '请输入正则表达式模式';
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      const results: any = {
        pattern: pattern,
        flags: flags,
        testText: testText,
        isValid: true,
        matches: [],
        groups: [],
        replaceResult: '',
        matchCount: 0
      };
      
      // 查找所有匹配
      let match;
      const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      
      while ((match = globalRegex.exec(testText)) !== null) {
        results.matches.push({
          match: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1)
        });
        
        results.matchCount++;
        
        // 避免无限循环
        if (match.index === globalRegex.lastIndex) {
          globalRegex.lastIndex++;
        }
      }
      
      // 替换操作
      if (replaceText !== undefined) {
        results.replaceResult = testText.replace(regex, replaceText);
      }
      
      // 测试单个匹配
      const singleMatch = testText.match(regex);
      if (singleMatch) {
        results.groups = singleMatch.slice(1);
      }
      
      return JSON.stringify(results, null, 2);
    } catch (error) {
      return JSON.stringify({
        pattern: pattern,
        flags: flags,
        testText: testText,
        isValid: false,
        error: error instanceof Error ? error.message : '未知错误'
      }, null, 2);
    }
  }
}
