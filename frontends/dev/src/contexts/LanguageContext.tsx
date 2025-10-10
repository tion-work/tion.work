"use client";

import { getUserLanguage, setUserLanguage } from "@/lib/language";
import { enContent } from "@/locales/en";
import { zhContent } from "@/locales/zh";
import { Language } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// 语言内容类型
type Content = typeof zhContent;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  content: Content;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取用户语言偏好
    const userLang = getUserLanguage();
    setLanguageState(userLang);
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setUserLanguage(lang);
  };

  // 根据语言选择内容
  const content = language === "zh" ? zhContent : enContent;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, content, isLoading }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// 便捷的hook用于获取翻译内容
export function useTranslation() {
  const { content } = useLanguage();
  return content;
}

// 类型安全的翻译hook
export function useT() {
  const { content } = useLanguage();
  return content;
}
