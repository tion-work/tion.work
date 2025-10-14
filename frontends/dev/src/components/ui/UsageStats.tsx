"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { StatsData, statsManager } from "@/lib/stats";
import { Clock, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "./Card";

interface UsageStatsProps {
  toolId?: string;
  className?: string;
}

export function UsageStats({ toolId, className = "" }: UsageStatsProps) {
  const { content, language } = useLanguage();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 获取真实统计数据
        const realStats = statsManager.getStats();

        // 如果数据为空，显示默认值
        if (realStats.totalUses === 0) {
          const defaultStats: StatsData = {
            totalUses: 0,
            todayUses: 0,
            thisWeekUses: 0,
            thisMonthUses: 0,
            averageTime: 0,
            successRate: 0,
            popularTools: [],
            recentActivity: [],
            hourlyUsage: [],
            dailyUsage: [],
          };
          setStats(defaultStats);
        } else {
          setStats(realStats);
        }
      } catch (error) {
        console.error("Failed to fetch usage stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toolId, language]);

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 总体统计 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {language === "en" ? "Usage Statistics" : "使用统计"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.totalUses.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {language === "en" ? "Total Uses" : "总使用次数"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.todayUses}
            </div>
            <div className="text-sm text-gray-600">
              {language === "en" ? "Today" : "今日使用"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.thisWeekUses}
            </div>
            <div className="text-sm text-gray-600">
              {language === "en" ? "This Week" : "本周使用"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.thisMonthUses}
            </div>
            <div className="text-sm text-gray-600">
              {language === "en" ? "This Month" : "本月使用"}
            </div>
          </div>
        </div>
      </Card>

      {/* 性能指标 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {language === "en" ? "Performance Metrics" : "性能指标"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {language === "en" ? "Average Processing Time" : "平均处理时间"}
              </span>
              <span className="text-sm font-semibold">
                {stats.averageTime}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (stats.averageTime / 5) * 100)}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {language === "en" ? "Success Rate" : "成功率"}
              </span>
              <span className="text-sm font-semibold">
                {stats.successRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${stats.successRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* 热门工具 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          {language === "en" ? "Popular Tools" : "热门工具"}
        </h3>
        <div className="space-y-3">
          {stats.popularTools.map((tool, index) => (
            <div key={tool.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (tool.uses / stats.popularTools[0].uses) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">
                  {tool.uses.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 最近活动 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {language === "en" ? "Recent Activity" : "最近活动"}
        </h3>
        <div className="space-y-2">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity, index) => {
              const timeAgo = Math.floor(
                (Date.now() - activity.timestamp) / 1000
              );
              const timeText =
                timeAgo < 60
                  ? `${timeAgo}s ago`
                  : timeAgo < 3600
                  ? `${Math.floor(timeAgo / 60)}m ago`
                  : `${Math.floor(timeAgo / 3600)}h ago`;

              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.success ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="flex-1">
                    {activity.toolName}{" "}
                    {activity.success ? "completed" : "failed"}
                  </span>
                  <span className="text-xs text-gray-500">{timeText}</span>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              {language === "en" ? "No recent activity" : "暂无最近活动"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
