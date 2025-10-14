import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BaseTool } from "@/lib/tools/base";
import { HelpCircle } from "lucide-react";
import React from "react";

interface ToolCardProps {
  tool: BaseTool;
  onClick: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  className,
}) => {
  const { language } = useLanguage();
  // 使用默认图标，避免动态导入的复杂性
  const IconComponent = HelpCircle;

  return (
    <Card
      className={`p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group h-full ${
        className || ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`h-10 w-10 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {tool.getLocalizedContent(language || "zh").name}
            </h3>
            <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 flex-1">
          {tool.getLocalizedContent(language || "zh").description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">点击使用</span>
        </div>
      </div>
    </Card>
  );
};

export default ToolCard;
