import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class LoremGeneratorTool extends BaseTool {
  id = 'lorem-generator';
  name = 'Lorem Ipsum 生成器';
  description = '生成 Lorem Ipsum 占位文本，支持多种格式和长度。';
  category: ToolCategory = 'text';
  icon = 'Type';
  slug = 'lorem-generator';

  options = [
    {
      key: 'type',
      label: '生成类型',
      type: 'select',
      defaultValue: 'paragraphs',
      description: '选择要生成的文本类型',
      options: [
        { value: 'paragraphs', label: '段落' },
        { value: 'sentences', label: '句子' },
        { value: 'words', label: '单词' },
        { value: 'characters', label: '字符' }
      ]
    },
    {
      key: 'count',
      label: '数量',
      type: 'number',
      defaultValue: 3,
      description: '要生成的数量（1-50）'
    },
    {
      key: 'startWithLorem',
      label: '以 Lorem ipsum 开始',
      type: 'boolean',
      defaultValue: true,
      description: '是否以 "Lorem ipsum dolor sit amet" 开始'
    }
  ];

  private loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { type = 'paragraphs', count = 3, startWithLorem = true } = options || {};
    const numCount = Math.min(Math.max(parseInt(count) || 3, 1), 50);
    
    try {
      switch (type) {
        case 'paragraphs':
          return this.generateParagraphs(numCount, startWithLorem);
        case 'sentences':
          return this.generateSentences(numCount, startWithLorem);
        case 'words':
          return this.generateWords(numCount);
        case 'characters':
          return this.generateCharacters(numCount);
        default:
          return this.generateParagraphs(numCount, startWithLorem);
      }
    } catch (error: any) {
      throw new Error(`Lorem Ipsum 生成失败: ${error.message}`);
    }
  }

  private generateParagraphs(count: number, startWithLorem: boolean): string {
    const paragraphs: string[] = [];
    
    for (let i = 0; i < count; i++) {
      let paragraph = '';
      
      if (i === 0 && startWithLorem) {
        paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';
      }
      
      // 生成 3-7 个句子
      const sentenceCount = Math.floor(Math.random() * 5) + 3;
      for (let j = 0; j < sentenceCount; j++) {
        paragraph += this.generateSentence();
        if (j < sentenceCount - 1) paragraph += ' ';
      }
      
      paragraphs.push(paragraph);
    }
    
    return paragraphs.join('\n\n');
  }

  private generateSentences(count: number, startWithLorem: boolean): string {
    const sentences: string[] = [];
    
    if (startWithLorem) {
      sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
    }
    
    for (let i = sentences.length; i < count; i++) {
      sentences.push(this.generateSentence());
    }
    
    return sentences.join(' ');
  }

  private generateWords(count: number): string {
    const words: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.loremWords.length);
      words.push(this.loremWords[randomIndex]);
    }
    
    return words.join(' ');
  }

  private generateCharacters(count: number): string {
    let text = '';
    let currentLength = 0;
    
    while (currentLength < count) {
      const randomIndex = Math.floor(Math.random() * this.loremWords.length);
      const word = this.loremWords[randomIndex];
      
      if (currentLength + word.length + 1 <= count) {
        text += (text ? ' ' : '') + word;
        currentLength += word.length + (text ? 1 : 0);
      } else {
        // 添加部分单词以接近目标长度
        const remaining = count - currentLength;
        if (remaining > 0) {
          text += (text ? ' ' : '') + word.substring(0, remaining);
        }
        break;
      }
    }
    
    return text;
  }

  private generateSentence(): string {
    const words: string[] = [];
    const wordCount = Math.floor(Math.random() * 8) + 5; // 5-12 个单词
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * this.loremWords.length);
      words.push(this.loremWords[randomIndex]);
    }
    
    // 首字母大写
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    
    return words.join(' ') + '.';
  }

  validate(input: string): boolean {
    return true; // Lorem Ipsum 生成不需要输入验证
  }
}
