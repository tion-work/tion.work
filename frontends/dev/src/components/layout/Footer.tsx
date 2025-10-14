"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import React from "react";

const Footer: React.FC = () => {
  const { content } = useLanguage();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* 主要内容区域 - 居中显示 */}
        <div className="flex flex-col items-center gap-4">
          {/* 品牌信息 */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8">
              <img
                src="/icon.png"
                alt="TiON Logo"
                className="h-8 w-8 rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">TiON</span>
          </div>

          {/* 网站描述 */}
          <p className="text-sm text-gray-600 text-center max-w-md">
            {content.footer.description ||
              "现代化开发者工具集合平台，为开发者提供一站式解决方案"}
          </p>

          {/* 版权信息 */}
          <div className="text-center">
            <p className="text-xs text-gray-500">{content.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
