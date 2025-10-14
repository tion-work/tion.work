"use client";

import { Dropdown } from "@/components/ui/Dropdown";
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

  const handleLanguageChange = (lang: string) => {
    const language = lang as Language;
    if (language === currentLang) return;

    setCurrentLang(language);
    setUserLanguage(language);

    // 添加平滑过渡效果
    document.body.style.transition = "opacity 0.3s ease";
    document.body.style.opacity = "0.7";

    // 延迟重新加载以显示过渡效果
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  // 准备下拉菜单数据
  const dropdownItems = Object.entries(languageConfig).map(
    ([code, config]) => ({
      value: code,
      label: config.name,
      flag: config.flag,
    })
  );

  // 服务端渲染时显示默认状态
  if (!isClient) {
    return (
      <div className={`flex items-center ${className}`}>
        <Dropdown
          items={dropdownItems}
          value="en"
          onValueChange={handleLanguageChange}
          triggerClassName="px-3 py-2"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Dropdown
        items={dropdownItems}
        value={currentLang}
        onValueChange={handleLanguageChange}
        triggerClassName="px-3 py-2"
      />
    </div>
  );
}
