"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { statsManager } from "@/lib/stats";
import { Download, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

interface StatsManagerProps {
  onStatsUpdate?: () => void;
}

export function StatsManager({ onStatsUpdate }: StatsManagerProps) {
  const { content, language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      statsManager.exportData();
    } catch (error) {
      console.error("Failed to export data:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = async () => {
    if (
      confirm(
        language === "en"
          ? "Are you sure you want to clear all statistics data?"
          : "确定要清除所有统计数据吗？"
      )
    ) {
      setIsClearing(true);
      try {
        statsManager.clearAllData();
        onStatsUpdate?.();
      } catch (error) {
        console.error("Failed to clear data:", error);
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleRefresh = () => {
    onStatsUpdate?.();
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {language === "en" ? "Data Management" : "数据管理"}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {language === "en" ? "Refresh Stats" : "刷新统计"}
          </Button>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting
              ? language === "en"
                ? "Exporting..."
                : "导出中..."
              : language === "en"
              ? "Export Data"
              : "导出数据"}
          </Button>

          <Button
            onClick={handleClear}
            disabled={isClearing}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            {isClearing
              ? language === "en"
                ? "Clearing..."
                : "清除中..."
              : language === "en"
              ? "Clear Data"
              : "清除数据"}
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            {language === "en"
              ? "Statistics are stored locally in your browser. Export your data to backup or clear to reset all statistics."
              : "统计数据存储在您的浏览器本地。您可以导出数据进行备份，或清除数据重置所有统计。"}
          </p>
        </div>
      </div>
    </Card>
  );
}
