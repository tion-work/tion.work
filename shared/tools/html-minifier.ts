import { BaseTool } from './base';

export class HTMLMinifierTool extends BaseTool {
  id = 'html-minifier';
  name = 'HTML 压缩器';
  description = '压缩 HTML 代码，移除空白字符、注释和冗余属性，优化页面加载速度';
  category = 'code';
  icon = 'file-text';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      removeComments = true,
      removeEmptyAttributes = true,
      removeEmptyElements = false,
      removeOptionalTags = true,
      removeRedundantAttributes = true,
      collapseWhitespace = true,
      minifyCSS = true,
      minifyJS = true,
      removeScriptTypeAttributes = true,
      removeStyleLinkTypeAttributes = true
    } = options;

    try {
      return this.minifyHTML(input, {
        removeComments,
        removeEmptyAttributes,
        removeEmptyElements,
        removeOptionalTags,
        removeRedundantAttributes,
        collapseWhitespace,
        minifyCSS,
        minifyJS,
        removeScriptTypeAttributes,
        removeStyleLinkTypeAttributes
      });
    } catch (error) {
      throw new Error(`HTML 压缩失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    // 简单的 HTML 验证
    return input.trim().length > 0;
  }

  private minifyHTML(html: string, options: any): string {
    let minified = html;
    
    // 移除注释
    if (options.removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    // 压缩空白字符
    if (options.collapseWhitespace) {
      minified = minified.replace(/\s+/g, ' ');
      minified = minified.replace(/>\s+</g, '><');
    }
    
    // 移除可选标签
    if (options.removeOptionalTags) {
      // 移除可选的结束标签
      minified = minified.replace(/<\/?(html|head|body|p|li|dt|dd|option|thead|tbody|tfoot|tr|td|th)>/g, '');
    }
    
    // 移除空属性
    if (options.removeEmptyAttributes) {
      minified = minified.replace(/\s+\w+=""/g, '');
      minified = minified.replace(/\s+\w+=''/g, '');
    }
    
    // 移除空元素
    if (options.removeEmptyElements) {
      minified = minified.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '');
    }
    
    // 移除冗余属性
    if (options.removeRedundantAttributes) {
      // 移除 script 标签的 type 属性
      if (options.removeScriptTypeAttributes) {
        minified = minified.replace(/<script([^>]*)\s+type\s*=\s*["']text\/javascript["']([^>]*)>/gi, '<script$1$2>');
      }
      
      // 移除 style 和 link 标签的 type 属性
      if (options.removeStyleLinkTypeAttributes) {
        minified = minified.replace(/<(style|link)([^>]*)\s+type\s*=\s*["']text\/css["']([^>]*)>/gi, '<$1$2$3>');
      }
      
      // 移除 input 标签的 type="text" 属性
      minified = minified.replace(/<input([^>]*)\s+type\s*=\s*["']text["']([^>]*)>/gi, '<input$1$2>');
    }
    
    // 压缩内联 CSS
    if (options.minifyCSS) {
      minified = minified.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
        const minifiedCSS = this.minifyInlineCSS(css);
        return match.replace(css, minifiedCSS);
      });
    }
    
    // 压缩内联 JavaScript
    if (options.minifyJS) {
      minified = minified.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, js) => {
        const minifiedJS = this.minifyInlineJS(js);
        return match.replace(js, minifiedJS);
      });
    }
    
    // 移除多余的空白
    minified = minified.replace(/\s+/g, ' ');
    minified = minified.replace(/>\s+</g, '><');
    minified = minified.trim();
    
    return minified;
  }
  
  private minifyInlineCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ') // 压缩空白
      .replace(/;\s*/g, ';') // 移除分号后的空白
      .replace(/\s*{\s*/g, '{') // 压缩大括号
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':') // 压缩冒号
      .trim();
  }
  
  private minifyInlineJS(js: string): string {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
      .replace(/\/\/.*$/gm, '') // 移除行注释
      .replace(/\s+/g, ' ') // 压缩空白
      .replace(/;\s*/g, ';') // 移除分号后的空白
      .replace(/\s*{\s*/g, '{') // 压缩大括号
      .replace(/\s*}\s*/g, '}')
      .trim();
  }
}
