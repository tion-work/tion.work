"use client";

import { ToolCard } from "@/components/tools/ToolCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { ToolRegistry, registerTools } from "@/lib/tools";
import { BaseTool } from "@/lib/tools/base";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { content, language } = useLanguage();
  const [tools, setTools] = useState<BaseTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 注册所有工具
      registerTools();

      // 获取所有工具
      const allTools = ToolRegistry.getAll();
      console.log("注册的工具数量:", allTools.length);

      // 直接使用 BaseTool 实例
      console.log("工具数量:", allTools.length);
      setTools(allTools);
      setLoading(false);
    } catch (error) {
      console.error("工具加载错误:", error);
      setLoading(false);
    }
  }, [language]); // 添加 language 作为依赖

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* 为固定header留出空间 */}
        <div className="h-16"></div>

        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{content.common.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 为固定header留出空间 */}
      <div className="h-16"></div>

      {/* 工具展示区域 */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {content.homepage.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {content.homepage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <ToolCard tool={tool} onClick={() => {}} className="h-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
