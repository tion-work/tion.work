"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const { content } = useLanguage();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 品牌信息 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TiON</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              {content.footer.description}
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {content.footer.quickLinks}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/stats"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {content.navigation.stats}
              </Link>
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {content.navigation.about}
              </Link>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {content.footer.contactUs}
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://x.com/xtion88"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:admin@tion.work"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-600">{content.footer.copyright}</p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {content.common.privacy}
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {content.common.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
