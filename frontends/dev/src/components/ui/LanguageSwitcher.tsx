"use client";

import { Button } from "@/components/ui/Button";
import {
  getUserLanguage,
  languageConfig,
  setUserLanguage,
} from "@/lib/language";
import { Language } from "@/types";
import { useEffect, useState } from "react";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentLang(getUserLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    if (lang === currentLang) return;

    setCurrentLang(lang);
    setUserLanguage(lang);

    // 添加平滑过渡效果
    document.body.style.transition = "opacity 0.3s ease";
    document.body.style.opacity = "0.7";

    // 延迟重新加载以显示过渡效果
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  // 服务端渲染时显示默认状态
  if (!isClient) {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <Button variant="outline" size="sm" className="px-2 py-1 text-xs">
          🇺🇸 EN
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Object.entries(languageConfig).map(([code, config]) => (
        <Button
          key={code}
          variant={currentLang === code ? "primary" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange(code as Language)}
          className={`px-2 py-1 text-xs transition-all ${
            currentLang === code
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          <span className="mr-1">{config.flag}</span>
          {config.name}
        </Button>
      ))}
    </div>
  );
}
