import { BaseTool } from './base';

export class URLAnalyzerTool extends BaseTool {
  id = 'url-analyzer';
  name = 'URL 分析器';
  description = '分析 URL 的各个组成部分，提供详细的解析信息。';
  category = 'utility';
  icon = 'Link';
  slug = 'url-analyzer';

  options = [
    {
      key: 'includeSecurity',
      label: '包含安全分析',
      type: 'boolean',
      defaultValue: true,
      description: '是否包含 URL 安全性分析'
    },
    {
      key: 'includeSEO',
      label: '包含 SEO 分析',
      type: 'boolean',
      defaultValue: true,
      description: '是否包含 SEO 相关分析'
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { includeSecurity = true, includeSEO = true } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          error: '输入为空',
          message: '请输入要分析的 URL'
        }, null, 2);
      }

      const url = input.trim();
      const analysis = this.analyzeURL(url, { includeSecurity, includeSEO });
      
      return JSON.stringify(analysis, null, 2);
    } catch (error: any) {
      throw new Error(`URL 分析失败: ${error.message}`);
    }
  }

  private analyzeURL(url: string, options: any): any {
    try {
      const urlObj = new URL(url);
      
      const analysis: any = {
        url: url,
        valid: true,
        components: {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80'),
          pathname: urlObj.pathname,
          search: urlObj.search,
          hash: urlObj.hash,
          origin: urlObj.origin,
          href: urlObj.href
        },
        domain: {
          domain: urlObj.hostname,
          subdomain: this.extractSubdomain(urlObj.hostname),
          tld: this.extractTLD(urlObj.hostname),
          isIP: this.isIPAddress(urlObj.hostname)
        },
        parameters: this.parseParameters(urlObj.search),
        path: this.parsePath(urlObj.pathname)
      };

      if (options.includeSecurity) {
        analysis.security = this.analyzeSecurity(urlObj);
      }

      if (options.includeSEO) {
        analysis.seo = this.analyzeSEO(urlObj);
      }

      return analysis;
    } catch (error) {
      return {
        url: url,
        valid: false,
        error: '无效的 URL 格式',
        message: error instanceof Error ? error.message : 'URL 解析失败'
      };
    }
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(0, -2).join('.');
    }
    return null;
  }

  private extractTLD(hostname: string): string {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }

  private isIPAddress(hostname: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(hostname) || ipv6Regex.test(hostname);
  }

  private parseParameters(search: string): any {
    const params: any = {};
    if (search) {
      const urlSearchParams = new URLSearchParams(search);
      for (const [key, value] of urlSearchParams) {
        params[key] = value;
      }
    }
    return params;
  }

  private parsePath(pathname: string): any {
    const segments = pathname.split('/').filter(segment => segment.length > 0);
    return {
      segments: segments,
      depth: segments.length,
      lastSegment: segments[segments.length - 1] || null,
      hasExtension: this.hasFileExtension(segments[segments.length - 1] || '')
    };
  }

  private hasFileExtension(filename: string): boolean {
    return /\.\w+$/.test(filename);
  }

  private analyzeSecurity(urlObj: URL): any {
    const security: any = {
      isHTTPS: urlObj.protocol === 'https:',
      isHTTP: urlObj.protocol === 'http:',
      hasPort: !!urlObj.port,
      port: urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80'),
      warnings: []
    };

    // 安全检查
    if (urlObj.protocol === 'http:') {
      security.warnings.push('使用 HTTP 协议，数据传输不安全');
    }

    if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
      security.warnings.push(`使用非标准端口: ${urlObj.port}`);
    }

    // 检查可疑字符
    if (urlObj.href.includes('%')) {
      security.warnings.push('URL 包含编码字符，可能存在安全风险');
    }

    // 检查长度
    if (urlObj.href.length > 2048) {
      security.warnings.push('URL 过长，可能被某些浏览器截断');
    }

    return security;
  }

  private analyzeSEO(urlObj: URL): any {
    const seo: any = {
      pathLength: urlObj.pathname.length,
      parameterCount: new URLSearchParams(urlObj.search).size,
      hasHash: !!urlObj.hash,
      pathDepth: urlObj.pathname.split('/').filter(s => s).length,
      recommendations: []
    };

    // SEO 建议
    if (urlObj.pathname.length > 100) {
      seo.recommendations.push('URL 路径过长，建议缩短以提高可读性');
    }

    if (seo.parameterCount > 5) {
      seo.recommendations.push('URL 参数过多，考虑使用路径参数');
    }

    if (urlObj.hash) {
      seo.recommendations.push('URL 包含锚点，搜索引擎可能不会索引锚点后的内容');
    }

    if (seo.pathDepth > 3) {
      seo.recommendations.push('URL 层级过深，建议控制在 3 层以内');
    }

    // 检查 URL 结构
    const pathSegments = urlObj.pathname.split('/').filter(s => s);
    const hasNumbers = pathSegments.some(segment => /\d/.test(segment));
    if (hasNumbers) {
      seo.recommendations.push('URL 包含数字，考虑使用有意义的文字');
    }

    return seo;
  }

  validate(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }
}
