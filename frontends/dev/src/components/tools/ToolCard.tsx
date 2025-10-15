import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTool } from "@/lib/tools/base";
import {
  CheckCircle,
  Clock,
  Code,
  Database,
  FileCode,
  HardDrive,
  Hash,
  Link,
  Minimize,
  Palette,
  Search,
  Shield,
  Shuffle,
  Star,
  Type,
  Wrench,
  Zap,
} from "lucide-react";
import React from "react";

interface ToolCardProps {
  tool: BaseTool;
  onClick: () => void;
  className?: string;
}

// 图标映射
const iconMap: Record<string, React.ComponentType<any>> = {
  Code: Code,
  Database: Database,
  Shield: Shield,
  Wrench: Wrench,
  Palette: Palette,
  Type: Type,
  Hash: Hash,
  CheckCircle: CheckCircle,
  Link: Link,
  Shuffle: Shuffle,
  HardDrive: HardDrive,
  Clock: Clock,
  Minimize: Minimize,
  FileCode: FileCode,
  Zap: Zap,
  Search: Search,
  Star: Star,
};

// 分类颜色映射
const categoryColors: Record<string, string> = {
  code: "from-blue-500 to-blue-600",
  data: "from-green-500 to-green-600",
  security: "from-red-500 to-red-600",
  utility: "from-purple-500 to-purple-600",
  design: "from-pink-500 to-pink-600",
  text: "from-indigo-500 to-indigo-600",
  time: "from-orange-500 to-orange-600",
  network: "from-cyan-500 to-cyan-600",
};

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  className,
}) => {
  const { language, content } = useLanguage();
  const IconComponent = iconMap[tool.icon] || Code;
  const gradientClass =
    categoryColors[tool.category] || "from-gray-500 to-gray-600";

  // 获取分类的本地化名称
  const getCategoryName = (category: string) => {
    return (
      content.categories[category as keyof typeof content.categories] ||
      category
    );
  };

  return (
    <div
      className={`tool-card group cursor-pointer h-full ${className || ""}`}
      onClick={onClick}
    >
      <div className="p-6 h-full flex flex-col">
        {/* 头部区域 */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`tool-icon bg-gradient-to-br ${gradientClass} shadow-lg`}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">
              {content.toolCard.online}
            </span>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:gradient-text transition-all duration-300 mb-2 text-lg">
            {tool.getLocalizedContent(language || "zh").name}
          </h3>

          <div className="mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradientClass} text-white shadow-sm`}
            >
              {getCategoryName(tool.category)}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
            {tool.getLocalizedContent(language || "zh").description}
          </p>
        </div>

        {/* 底部区域 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <span>{content.toolCard.free}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-primary-600 transition-colors">
            <span>{content.toolCard.useNow}</span>
            <svg
              className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
