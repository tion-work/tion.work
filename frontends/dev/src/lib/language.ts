import { Language } from "@/types";

/**
 * 检测用户浏览器语言
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language || (navigator as any).userLanguage;

  // 检查是否为中文
  if (browserLang.startsWith("zh")) {
    return "zh";
  }

  // 检查是否为日语
  if (browserLang.startsWith("ja")) {
    return "ja";
  }

  // 默认返回英文
  return "en";
}

/**
 * 获取用户偏好的语言
 * 优先级：本地存储 > 浏览器语言 > 默认英文
 */
export function getUserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  // 1. 检查本地存储的用户选择
  const savedLang = localStorage.getItem("preferred-language") as Language;
  if (
    savedLang &&
    (savedLang === "zh" || savedLang === "en" || savedLang === "ja")
  ) {
    return savedLang;
  }

  // 2. 检测浏览器语言
  return detectBrowserLanguage();
}

/**
 * 设置用户语言偏好
 */
export function setUserLanguage(language: Language): void {
  if (typeof window === "undefined") return;

  localStorage.setItem("preferred-language", language);
}

/**
 * 语言配置
 */
export const languageConfig = {
  en: {
    name: "English",
    flag: "🇺🇸",
    code: "en",
  },
  ja: {
    name: "日本語",
    flag: "🇯🇵",
    code: "ja",
  },
  zh: {
    name: "中文",
    flag: "🇨🇳",
    code: "zh",
  },
} as const;
