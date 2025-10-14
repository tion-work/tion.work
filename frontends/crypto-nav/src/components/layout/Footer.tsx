import { Github, Globe, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 rounded-lg w-8 h-8 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">crypto.tion.work</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              专为加密货币投资者而生，聚合优质网站、教程、工具，一站式加密货币投资导航平台。
              100%免费使用，持续更新中。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@tion.work"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="#websites"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  网站导航
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  专业工具
                </Link>
              </li>
              <li>
                <Link
                  href="#tutorials"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  教程中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">热门工具</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools/calculator"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  收益计算器
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/dca"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  DCA定投计算器
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/fire"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FIRE计算器
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/address-validator"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  地址验证
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 crypto.tion.work. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                使用条款
              </Link>
              <Link
                href="/disclaimer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                免责声明
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
