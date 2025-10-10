// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.tion.work',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// 工具分类
export const TOOL_CATEGORIES = {
  CODE: 'code',
  DATA: 'data',
  SECURITY: 'security',
  UTILITY: 'utility',
  DESIGN: 'design',
  TEXT: 'text',
} as const;

// 工具分类标签
export const CATEGORY_LABELS = {
  [TOOL_CATEGORIES.CODE]: '代码工具',
  [TOOL_CATEGORIES.DATA]: '数据处理',
  [TOOL_CATEGORIES.SECURITY]: '安全工具',
  [TOOL_CATEGORIES.UTILITY]: '实用工具',
  [TOOL_CATEGORIES.DESIGN]: '设计工具',
  [TOOL_CATEGORIES.TEXT]: '文本工具',
} as const;

// 主题配置
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 语言配置
export const LANGUAGE_CONFIG = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
} as const;

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// 搜索配置
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'text/plain',
    'application/json',
    'text/csv',
    'text/xml',
    'application/xml',
    'text/yaml',
    'application/x-yaml',
  ],
} as const;

// 通知配置
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  WARNING_DURATION: 5000,
  INFO_DURATION: 4000,
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  TOOLS_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  STATS_CACHE_TTL: 10 * 60 * 1000, // 10 minutes
  SEARCH_CACHE_TTL: 2 * 60 * 1000, // 2 minutes
} as const;

// 验证配置
export const VALIDATION_CONFIG = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  JSON_REGEX: /^[\s\S]*$/,
  XML_REGEX: /^[\s\S]*$/,
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  VALIDATION_ERROR: '输入数据格式不正确',
  NOT_FOUND: '请求的资源不存在',
  UNAUTHORIZED: '未授权访问，请先登录',
  FORBIDDEN: '访问被拒绝，权限不足',
  RATE_LIMITED: '请求过于频繁，请稍后重试',
  TIMEOUT: '请求超时，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请联系管理员',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  SAVED: '保存成功',
  DELETED: '删除成功',
  UPDATED: '更新成功',
  CREATED: '创建成功',
  COPIED: '已复制到剪贴板',
  DOWNLOADED: '下载完成',
  UPLOADED: '上传成功',
} as const;

// 工具图标映射
export const TOOL_ICONS = {
  'json-formatter': '📄',
  'base64-encoder': '🔤',
  'password-generator': '🔐',
  'timestamp-converter': '⏰',
  'qr-code-generator': '📱',
  'url-encoder': '🔗',
  'hash-generator': '🔒',
  'javascript-formatter': '⚡',
  'css-minifier': '🎨',
  'html-minifier': '🌐',
  'markdown-converter': '📝',
  'python-formatter': '🐍',
  'xml-formatter': '📋',
  'sql-formatter': '🗄️',
  'yaml-converter': '📊',
  'csv-converter': '📈',
  'regex-tester': '🔍',
  'color-picker': '🎨',
  'jwt-decoder': '🔑',
  'url-shortener': '✂️',
  'text-diff': '📊',
  'uuid-generator': '🆔',
  'lorem-generator': '📜',
  'json-validator': '✅',
  'xml-validator': '✅',
  'sql-optimizer': '⚡',
  'random-data-generator': '🎲',
  'file-size-calculator': '📏',
  'time-calculator': '⏱️',
  'url-analyzer': '🔍',
} as const;

// 默认工具配置
export const DEFAULT_TOOL_CONFIG = {
  name: '未命名工具',
  description: '暂无描述',
  category: TOOL_CATEGORIES.UTILITY,
  icon: '🔧',
  isActive: true,
  options: [],
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  THEME: 'tion-theme',
  LANGUAGE: 'tion-language',
  SETTINGS: 'tion-settings',
  HISTORY: 'tion-history',
  FAVORITES: 'tion-favorites',
  RECENT_TOOLS: 'tion-recent-tools',
} as const;

// 路由路径
export const ROUTES = {
  HOME: '/',
  TOOLS: '/tools',
  TOOL_DETAIL: '/tools/[id]',
  STATS: '/stats',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

// 外部链接
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/tion-work',
  TWITTER: 'https://x.com/xtion88',
  EMAIL: 'mailto:contact@dev.tion.work',
  DOCS: 'https://docs.dev.tion.work',
  API_DOCS: 'https://api.tion.work/docs',
} as const;
