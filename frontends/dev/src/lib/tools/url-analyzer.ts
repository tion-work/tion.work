import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class URLAnalyzerTool extends BaseTool {
  id = "url-analyzer";
  name = "URL Analyzer";
  description = "Analyze URLs and extract components";
  category: ToolCategory = "utility";
  icon = "link";
  color = "bg-indigo-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter URL to analyze...";
  outputLanguage = "json";
  initialInput = "https://www.example.com/path?param=value#section";
  options = [
    {
      name: "format",
      label: "Output Format",
      type: "select" as const,
      defaultValue: "json",
      description: "Choose output format",
      options: [
        { label: "JSON", value: "json" },
        { label: "Text", value: "text" },
        { label: "Table", value: "table" },
      ],
    },
    {
      name: "includeValidation",
      label: "Include Validation",
      type: "boolean" as const,
      defaultValue: true,
      description: "Include URL validation results",
    },
    {
      name: "includeSecurity",
      label: "Include Security Info",
      type: "boolean" as const,
      defaultValue: true,
      description: "Include security analysis",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "URL Analyzer",
        description: "Analyze URLs and extract components",
        inputPlaceholder: "Enter URL to analyze...",
        options: [
          {
            name: "format",
            label: "Output Format",
            type: "select",
            defaultValue: "json",
            description: "Choose output format",
            options: [
              { label: "JSON", value: "json" },
              { label: "Text", value: "text" },
              { label: "Table", value: "table" },
            ],
          },
          {
            name: "includeValidation",
            label: "Include Validation",
            type: "boolean",
            defaultValue: true,
            description: "Include URL validation results",
          },
          {
            name: "includeSecurity",
            label: "Include Security Info",
            type: "boolean",
            defaultValue: true,
            description: "Include security analysis",
          },
        ],
      };
    }

    return {
      name: "URL 分析器",
      description: "分析 URL 并提取组件",
      inputPlaceholder: "请输入要分析的 URL...",
      options: [
        {
          name: "format",
          label: "输出格式",
          type: "select",
          defaultValue: "json",
          description: "选择输出格式",
          options: [
            { label: "JSON", value: "json" },
            { label: "文本", value: "text" },
            { label: "表格", value: "table" },
          ],
        },
        {
          name: "includeValidation",
          label: "包含验证",
          type: "boolean",
          defaultValue: true,
          description: "包含 URL 验证结果",
        },
        {
          name: "includeSecurity",
          label: "包含安全信息",
          type: "boolean",
          defaultValue: true,
          description: "包含安全分析",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const {
      format = "json",
      includeValidation = true,
      includeSecurity = true,
    } = options;

    if (!input.trim()) {
      return "Please provide a URL to analyze.";
    }

    try {
      const analysis = this.analyzeURL(
        input,
        includeValidation,
        includeSecurity
      );

      switch (format) {
        case "json":
          return JSON.stringify(analysis, null, 2);
        case "text":
          return this.formatAsText(analysis);
        case "table":
          return this.formatAsTable(analysis);
        default:
          return JSON.stringify(analysis, null, 2);
      }
    } catch (error) {
      return `Error: ${
        error instanceof Error ? error.message : "Invalid URL format"
      }`;
    }
  }

  private analyzeURL(
    url: string,
    includeValidation: boolean,
    includeSecurity: boolean
  ): any {
    const urlObj = new URL(url);
    const analysis: any = {
      original: url,
      components: {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === "https:" ? "443" : "80"),
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        username: urlObj.username || null,
        password: urlObj.password || null,
      },
      parsed: {
        domain: urlObj.hostname,
        subdomain: this.extractSubdomain(urlObj.hostname),
        tld: this.extractTLD(urlObj.hostname),
        path: urlObj.pathname,
        query: this.parseQueryString(urlObj.search),
        fragment: urlObj.hash.substring(1),
      },
    };

    if (includeValidation) {
      analysis.validation = this.validateURL(url);
    }

    if (includeSecurity) {
      analysis.security = this.analyzeSecurity(url);
    }

    return analysis;
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split(".");
    return parts.length > 2 ? parts.slice(0, -2).join(".") : null;
  }

  private extractTLD(hostname: string): string {
    const parts = hostname.split(".");
    return parts.length > 1 ? parts.slice(-2).join(".") : hostname;
  }

  private parseQueryString(search: string): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    if (search) {
      const queryString = search.substring(1);
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (key) {
          params[decodeURIComponent(key)] = value
            ? decodeURIComponent(value)
            : "";
        }
      });
    }
    return params;
  }

  private validateURL(url: string): any {
    try {
      new URL(url);
      return {
        valid: true,
        errors: [],
      };
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : "Invalid URL format"],
      };
    }
  }

  private analyzeSecurity(url: string): any {
    const urlObj = new URL(url);
    const security: any = {
      https: urlObj.protocol === "https:",
      hasCredentials: !!(urlObj.username || urlObj.password),
      suspiciousPatterns: [],
      recommendations: [],
    };

    // Check for suspicious patterns
    if (urlObj.hostname.includes("..")) {
      security.suspiciousPatterns.push("Double dots in hostname");
    }

    if (urlObj.hostname.includes("@")) {
      security.suspiciousPatterns.push("At symbol in hostname");
    }

    if (
      urlObj.hostname.includes("localhost") ||
      urlObj.hostname.includes("127.0.0.1")
    ) {
      security.suspiciousPatterns.push("Localhost or local IP");
    }

    // Add recommendations
    if (!security.https) {
      security.recommendations.push("Use HTTPS for secure communication");
    }

    if (security.hasCredentials) {
      security.recommendations.push("Avoid including credentials in URLs");
    }

    if (urlObj.hostname.includes("http://")) {
      security.recommendations.push("Remove http:// from hostname");
    }

    return security;
  }

  private formatAsText(analysis: any): string {
    let result = "URL Analysis\n";
    result += "=".repeat(50) + "\n\n";

    result += `Original URL: ${analysis.original}\n\n`;

    result += "Components:\n";
    result += `  Protocol: ${analysis.components.protocol}\n`;
    result += `  Hostname: ${analysis.components.hostname}\n`;
    result += `  Port: ${analysis.components.port}\n`;
    result += `  Path: ${analysis.components.pathname}\n`;
    result += `  Query: ${analysis.components.search || "None"}\n`;
    result += `  Fragment: ${analysis.components.hash || "None"}\n\n`;

    if (analysis.validation) {
      result += "Validation:\n";
      result += `  Valid: ${analysis.validation.valid ? "Yes" : "No"}\n`;
      if (analysis.validation.errors.length > 0) {
        result += `  Errors: ${analysis.validation.errors.join(", ")}\n`;
      }
      result += "\n";
    }

    if (analysis.security) {
      result += "Security:\n";
      result += `  HTTPS: ${analysis.security.https ? "Yes" : "No"}\n`;
      result += `  Has Credentials: ${
        analysis.security.hasCredentials ? "Yes" : "No"
      }\n`;
      if (analysis.security.suspiciousPatterns.length > 0) {
        result += `  Suspicious Patterns: ${analysis.security.suspiciousPatterns.join(
          ", "
        )}\n`;
      }
      if (analysis.security.recommendations.length > 0) {
        result += `  Recommendations: ${analysis.security.recommendations.join(
          ", "
        )}\n`;
      }
    }

    return result;
  }

  private formatAsTable(analysis: any): string {
    let result = "URL Analysis Results\n";
    result += "=".repeat(50) + "\n\n";

    result += "| Component | Value |\n";
    result += "|-----------|-------|\n";
    result += `| Protocol | ${analysis.components.protocol} |\n`;
    result += `| Hostname | ${analysis.components.hostname} |\n`;
    result += `| Port | ${analysis.components.port} |\n`;
    result += `| Path | ${analysis.components.pathname} |\n`;
    result += `| Query | ${analysis.components.search || "None"} |\n`;
    result += `| Fragment | ${analysis.components.hash || "None"} |\n\n`;

    if (
      analysis.parsed.query &&
      Object.keys(analysis.parsed.query).length > 0
    ) {
      result += "Query Parameters:\n";
      result += "| Key | Value |\n";
      result += "|-----|-------|\n";
      Object.entries(analysis.parsed.query).forEach(([key, value]) => {
        result += `| ${key} | ${value} |\n`;
      });
    }

    return result;
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }
}
