"use client";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToolRegistry, registerTools } from "@/lib/tools";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Code,
  Database,
  Globe,
  Palette,
  Search,
  Shield,
  Star,
  Type,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// 图标映射
const iconMap: Record<string, any> = {
  Code: Code,
  Database: Database,
  Shield: Shield,
  Wrench: Wrench,
  Palette: Palette,
  Type: Type,
  Hash: Clock,
  CheckCircle: CheckCircle,
  Link: Globe,
  Shuffle: Zap,
  HardDrive: Database,
  Clock: Clock,
  Minimize: Wrench,
  FileCode: Code,
  Markdown: Type,
  Zap: Zap,
  Search: Search,
  Star: Star,
};

// 颜色映射
const colorMap: Record<string, string> = {
  code: "bg-blue-500",
  data: "bg-green-500",
  security: "bg-red-500",
  utility: "bg-orange-500",
  text: "bg-indigo-500",
  design: "bg-pink-500",
  default: "bg-gray-500",
};

// 将features移到组件内部，以便使用多语言

export default function Home() {
  const { content, language } = useLanguage();
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 多语言特性列表
  const features = [
    {
      icon: Zap,
      title: content.pages.home.features?.fast || "极速响应",
      description: content.pages.home.features?.fastDesc || "毫秒级处理速度",
    },
    {
      icon: Globe,
      title: content.pages.home.features?.zeroConfig || "零配置",
      description:
        content.pages.home.features?.zeroConfigDesc || "无需注册即可使用",
    },
    {
      icon: Users,
      title: content.pages.home.features?.crossPlatform || "全平台",
      description:
        content.pages.home.features?.crossPlatformDesc || "支持所有设备",
    },
    {
      icon: Star,
      title: content.pages.home.features?.tools || "20+ 工具",
      description: content.pages.home.features?.toolsDesc || "持续更新中",
    },
  ];

  useEffect(() => {
    try {
      // 注册所有工具
      registerTools();

      // 获取所有工具
      const allTools = ToolRegistry.getAll();
      console.log("注册的工具数量:", allTools.length);

      // 转换为页面需要的格式，使用多语言内容
      const formattedTools = allTools.map((tool) => {
        const localizedContent = tool.getLocalizedContent(language || "zh");
        return {
          id: tool.id,
          name: localizedContent.name,
          description: localizedContent.description,
          icon: iconMap[tool.icon] || Code,
          category: tool.category,
          color: colorMap[tool.category] || colorMap.default,
        };
      });

      console.log("格式化后的工具数量:", formattedTools.length);
      setTools(formattedTools);
      setLoading(false);
    } catch (error) {
      console.error("工具加载错误:", error);
      setLoading(false);
    }
  }, [language]); // 添加 language 作为依赖

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{content.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 简洁头部 */}
      <section className="py-8 px-4 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-gray-600">
              {content.pages.home.subtitle.replace("20+", `${tools.length}+`)}
            </p>
          </div>
        </div>
      </section>

      {/* 所有工具展示 */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
                          {content.categories[
                            tool.category as keyof typeof content.categories
                          ] || tool.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 flex-1">
                      {tool.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {content.common.clickToUse || "点击使用"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
