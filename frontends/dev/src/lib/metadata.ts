import { Metadata } from "next";
import { getSEOConfig } from "./seo";

// 工具关键词生成器
function generateToolKeywords(
  toolName: string,
  toolId: string,
  language: string
): string[] {
  const keywords: string[] = [];

  // 添加工具名称的各种变体
  keywords.push(toolName.toLowerCase());
  keywords.push(toolId);

  // 根据工具ID生成特定关键词
  const toolKeywordMap: Record<string, Record<string, string[]>> = {
    "json-formatter": {
      zh: [
        "json格式化",
        "json美化",
        "json beautifier",
        "json prettifier",
        "json验证",
        "json压缩",
      ],
      en: [
        "json formatter",
        "json beautifier",
        "json prettifier",
        "json validator",
        "json minifier",
        "json online",
      ],
      ja: [
        "jsonフォーマッター",
        "jsonビューティファイアー",
        "jsonプリティファイアー",
        "jsonバリデーター",
        "jsonミニファイアー",
      ],
    },
    "base64-encoder": {
      zh: [
        "base64编码",
        "base64解码",
        "base64转换",
        "base64在线",
        "base64工具",
      ],
      en: [
        "base64 encoder",
        "base64 decoder",
        "base64 encode",
        "base64 decode",
        "base64 online",
      ],
      ja: [
        "base64エンコーダー",
        "base64デコーダー",
        "base64エンコード",
        "base64デコード",
        "base64オンライン",
      ],
    },
    "password-generator": {
      zh: ["密码生成器", "随机密码", "强密码", "密码工具", "安全密码"],
      en: [
        "password generator",
        "random password",
        "strong password",
        "secure password",
        "password tool",
      ],
      ja: [
        "パスワードジェネレーター",
        "ランダムパスワード",
        "強力なパスワード",
        "安全なパスワード",
        "パスワードツール",
      ],
    },
    "timestamp-converter": {
      zh: ["时间戳转换", "unix时间戳", "时间转换", "日期转换", "时间戳工具"],
      en: [
        "timestamp converter",
        "unix timestamp",
        "date converter",
        "time converter",
        "timestamp tool",
      ],
      ja: [
        "タイムスタンプコンバーター",
        "unixタイムスタンプ",
        "日付コンバーター",
        "時間コンバーター",
        "タイムスタンプツール",
      ],
    },
    "qr-code-generator": {
      zh: ["二维码生成", "qr码生成", "二维码制作", "qr码制作", "二维码工具"],
      en: [
        "qr code generator",
        "qr code maker",
        "qr code creator",
        "qr code tool",
        "qr generator",
      ],
      ja: [
        "qrコードジェネレーター",
        "qrコードメーカー",
        "qrコードクリエイター",
        "qrコードツール",
        "qrジェネレーター",
      ],
    },
    "url-encoder": {
      zh: ["url编码", "url解码", "url转换", "url工具", "网址编码"],
      en: [
        "url encoder",
        "url decoder",
        "url encode",
        "url decode",
        "url tool",
      ],
      ja: [
        "urlエンコーダー",
        "urlデコーダー",
        "urlエンコード",
        "urlデコード",
        "urlツール",
      ],
    },
    "hash-generator": {
      zh: ["哈希生成", "md5生成", "sha256生成", "哈希计算", "哈希工具"],
      en: [
        "hash generator",
        "md5 generator",
        "sha256 generator",
        "hash calculator",
        "hash tool",
      ],
      ja: [
        "ハッシュジェネレーター",
        "md5ジェネレーター",
        "sha256ジェネレーター",
        "ハッシュ計算機",
        "ハッシュツール",
      ],
    },
    "color-picker": {
      zh: ["颜色选择器", "颜色工具", "颜色代码", "十六进制颜色", "颜色转换"],
      en: [
        "color picker",
        "color tool",
        "color code",
        "hex color",
        "color converter",
      ],
      ja: [
        "カラーピッカー",
        "カラーツール",
        "カラーコード",
        "16進カラー",
        "カラーコンバーター",
      ],
    },
    "text-diff": {
      zh: ["文本对比", "文件对比", "文本比较", "差异对比", "对比工具"],
      en: [
        "text diff",
        "file diff",
        "text compare",
        "difference tool",
        "compare tool",
      ],
      ja: [
        "テキスト差分",
        "ファイル差分",
        "テキスト比較",
        "差分ツール",
        "比較ツール",
      ],
    },
    "sql-formatter": {
      zh: ["sql格式化", "sql美化", "sql工具", "sql格式化器", "sql prettifier"],
      en: [
        "sql formatter",
        "sql beautifier",
        "sql prettifier",
        "sql tool",
        "sql online",
      ],
      ja: [
        "sqlフォーマッター",
        "sqlビューティファイアー",
        "sqlプリティファイアー",
        "sqlツール",
        "sqlオンライン",
      ],
    },
    "xml-formatter": {
      zh: ["xml格式化", "xml美化", "xml工具", "xml格式化器", "xml prettifier"],
      en: [
        "xml formatter",
        "xml beautifier",
        "xml prettifier",
        "xml tool",
        "xml online",
      ],
      ja: [
        "xmlフォーマッター",
        "xmlビューティファイアー",
        "xmlプリティファイアー",
        "xmlツール",
        "xmlオンライン",
      ],
    },
    "yaml-converter": {
      zh: [
        "yaml转换",
        "yaml格式化",
        "yaml工具",
        "yaml转换器",
        "yaml formatter",
      ],
      en: [
        "yaml converter",
        "yaml formatter",
        "yaml tool",
        "yaml online",
        "yaml validator",
      ],
      ja: [
        "yamlコンバーター",
        "yamlフォーマッター",
        "yamlツール",
        "yamlオンライン",
        "yamlバリデーター",
      ],
    },
    "csv-converter": {
      zh: ["csv转换", "csv格式化", "csv工具", "csv转换器", "csv formatter"],
      en: [
        "csv converter",
        "csv formatter",
        "csv tool",
        "csv online",
        "csv validator",
      ],
      ja: [
        "csvコンバーター",
        "csvフォーマッター",
        "csvツール",
        "csvオンライン",
        "csvバリデーター",
      ],
    },
    "markdown-converter": {
      zh: [
        "markdown转换",
        "markdown编辑器",
        "markdown工具",
        "markdown转换器",
        "markdown formatter",
      ],
      en: [
        "markdown converter",
        "markdown editor",
        "markdown tool",
        "markdown formatter",
        "markdown online",
      ],
      ja: [
        "markdownコンバーター",
        "markdownエディター",
        "markdownツール",
        "markdownフォーマッター",
        "markdownオンライン",
      ],
    },
  };

  const toolKeywords = toolKeywordMap[toolId]?.[language] || [];
  keywords.push(...toolKeywords);

  return [...new Set(keywords)]; // 去重
}

export function generatePageMetadata(
  language: string = "zh",
  pageTitle?: string,
  pageDescription?: string,
  path: string = "/"
): Metadata {
  const seoConfig = getSEOConfig(language);
  const baseUrl = "https://dev.tion.work";
  const fullUrl = `${baseUrl}${path}`;

  return {
    title: pageTitle ? `${pageTitle} | ${seoConfig.title}` : seoConfig.title,
    description: pageDescription || seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: "dev.tion.work" }],
    creator: "dev.tion.work",
    publisher: "dev.tion.work",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: path,
      languages: {
        "zh-CN": fullUrl,
        "en-US": fullUrl,
        "ja-JP": fullUrl,
      },
    },
    openGraph: {
      title: pageTitle ? `${pageTitle} | ${seoConfig.title}` : seoConfig.title,
      description: pageDescription || seoConfig.description,
      url: fullUrl,
      siteName: "dev.tion.work",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: seoConfig.title,
        },
      ],
      locale: seoConfig.locale,
      alternateLocale: seoConfig.alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle ? `${pageTitle} | ${seoConfig.title}` : seoConfig.title,
      description: pageDescription || seoConfig.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateToolMetadata(
  toolName: string,
  toolDescription: string,
  language: string = "zh",
  toolId: string
): Metadata {
  const seoConfig = getSEOConfig(language);
  const baseUrl = "https://dev.tion.work";
  const toolUrl = `${baseUrl}/tools/${toolId}`;

  // 生成工具特定的关键词
  const toolKeywords = generateToolKeywords(toolName, toolId, language);

  return {
    title: `${toolName} | ${seoConfig.title}`,
    description: toolDescription,
    keywords: [...seoConfig.keywords, ...toolKeywords],
    authors: [{ name: "dev.tion.work" }],
    creator: "dev.tion.work",
    publisher: "dev.tion.work",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/tools/${toolId}`,
      languages: {
        "zh-CN": toolUrl,
        "en-US": toolUrl,
        "ja-JP": toolUrl,
      },
    },
    openGraph: {
      title: `${toolName} | ${seoConfig.title}`,
      description: toolDescription,
      url: toolUrl,
      siteName: "dev.tion.work",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${toolName} - ${seoConfig.title}`,
        },
      ],
      locale: seoConfig.locale,
      alternateLocale: seoConfig.alternateLocales,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${toolName} | ${seoConfig.title}`,
      description: toolDescription,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
