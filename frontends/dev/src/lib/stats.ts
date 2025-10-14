// 统计数据管理
export interface ToolUsage {
  toolId: string;
  timestamp: number;
  success: boolean;
  processingTime: number;
  userAgent?: string;
  ip?: string;
}

export interface StatsData {
  totalUses: number;
  todayUses: number;
  thisWeekUses: number;
  thisMonthUses: number;
  averageTime: number;
  successRate: number;
  popularTools: Array<{
    id: string;
    name: string;
    uses: number;
  }>;
  recentActivity: Array<{
    toolId: string;
    toolName: string;
    timestamp: number;
    success: boolean;
  }>;
  hourlyUsage: Array<{
    hour: number;
    uses: number;
  }>;
  dailyUsage: Array<{
    date: string;
    uses: number;
  }>;
}

class StatsManager {
  private storageKey = "tion-work-stats";
  private maxRecords = 10000; // 最多保存10000条记录

  // 记录工具使用
  recordToolUsage(toolId: string, success: boolean, processingTime: number) {
    const usage: ToolUsage = {
      toolId,
      timestamp: Date.now(),
      success,
      processingTime,
      userAgent:
        typeof window !== "undefined" ? navigator.userAgent : undefined,
    };

    // 获取现有数据
    const existingData = this.getStoredData();

    // 添加新记录
    existingData.push(usage);

    // 保持记录数量在限制内
    if (existingData.length > this.maxRecords) {
      existingData.splice(0, existingData.length - this.maxRecords);
    }

    // 保存到 localStorage
    this.saveData(existingData);
  }

  // 获取统计数据
  getStats(): StatsData {
    const data = this.getStoredData();
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // 计算各种统计数据
    const totalUses = data.length;
    const todayUses = data.filter(
      (usage) => usage.timestamp >= todayStart
    ).length;
    const thisWeekUses = data.filter(
      (usage) => usage.timestamp >= weekAgo
    ).length;
    const thisMonthUses = data.filter(
      (usage) => usage.timestamp >= monthAgo
    ).length;

    const successfulUses = data.filter((usage) => usage.success);
    const successRate =
      totalUses > 0 ? (successfulUses.length / totalUses) * 100 : 0;

    const totalProcessingTime = data.reduce(
      (sum, usage) => sum + usage.processingTime,
      0
    );
    const averageTime = totalUses > 0 ? totalProcessingTime / totalUses : 0;

    // 计算热门工具
    const toolUsageCount: { [key: string]: number } = {};
    data.forEach((usage) => {
      toolUsageCount[usage.toolId] = (toolUsageCount[usage.toolId] || 0) + 1;
    });

    const popularTools = Object.entries(toolUsageCount)
      .map(([toolId, uses]) => ({
        id: toolId,
        name: this.getToolDisplayName(toolId),
        uses,
      }))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 10);

    // 计算最近活动（最近10条）
    const recentActivity = data
      .slice(-10)
      .reverse()
      .map((usage) => ({
        toolId: usage.toolId,
        toolName: this.getToolDisplayName(usage.toolId),
        timestamp: usage.timestamp,
        success: usage.success,
      }));

    // 计算每小时使用量（最近24小时）
    const hourlyUsage = this.calculateHourlyUsage(data, now);

    // 计算每日使用量（最近30天）
    const dailyUsage = this.calculateDailyUsage(data, now);

    return {
      totalUses,
      todayUses,
      thisWeekUses,
      thisMonthUses,
      averageTime: Math.round(averageTime * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      popularTools,
      recentActivity,
      hourlyUsage,
      dailyUsage,
    };
  }

  // 获取工具显示名称
  private getToolDisplayName(toolId: string): string {
    const toolNames: { [key: string]: string } = {
      "json-formatter": "JSON Formatter",
      "base64-encoder": "Base64 Encoder",
      "password-generator": "Password Generator",
      "timestamp-converter": "Timestamp Converter",
      "qr-code-generator": "QR Code Generator",
      "markdown-converter": "Markdown Converter",
      "python-formatter": "Python Formatter",
      "xml-formatter": "XML Formatter",
      "sql-formatter": "SQL Formatter",
      "yaml-converter": "YAML Converter",
      "csv-converter": "CSV Converter",
      "regex-tester": "Regex Tester",
      "color-picker": "Color Picker",
      "jwt-decoder": "JWT Decoder",
      "url-shortener": "URL Shortener",
      "text-diff": "Text Diff",
      "uuid-generator": "UUID Generator",
      "lorem-generator": "Lorem Generator",
      "json-validator": "JSON Validator",
      "xml-validator": "XML Validator",
      "sql-optimizer": "SQL Optimizer",
      "random-data-generator": "Random Data Generator",
      "file-size-calculator": "File Size Calculator",
      "time-calculator": "Time Calculator",
      "url-analyzer": "URL Analyzer",
    };

    return toolNames[toolId] || toolId;
  }

  // 计算每小时使用量
  private calculateHourlyUsage(
    data: ToolUsage[],
    now: number
  ): Array<{ hour: number; uses: number }> {
    const hourlyUsage: { [key: number]: number } = {};

    // 初始化最近24小时
    for (let i = 0; i < 24; i++) {
      hourlyUsage[i] = 0;
    }

    // 统计最近24小时的使用量
    const last24Hours = now - 24 * 60 * 60 * 1000;
    data
      .filter((usage) => usage.timestamp >= last24Hours)
      .forEach((usage) => {
        const hour = new Date(usage.timestamp).getHours();
        hourlyUsage[hour] = (hourlyUsage[hour] || 0) + 1;
      });

    return Object.entries(hourlyUsage)
      .map(([hour, uses]) => ({
        hour: parseInt(hour),
        uses,
      }))
      .sort((a, b) => a.hour - b.hour);
  }

  // 计算每日使用量
  private calculateDailyUsage(
    data: ToolUsage[],
    now: number
  ): Array<{ date: string; uses: number }> {
    const dailyUsage: { [key: string]: number } = {};

    // 初始化最近30天
    for (let i = 0; i < 30; i++) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      dailyUsage[dateStr] = 0;
    }

    // 统计最近30天的使用量
    const last30Days = now - 30 * 24 * 60 * 60 * 1000;
    data
      .filter((usage) => usage.timestamp >= last30Days)
      .forEach((usage) => {
        const dateStr = new Date(usage.timestamp).toISOString().split("T")[0];
        if (dailyUsage.hasOwnProperty(dateStr)) {
          dailyUsage[dateStr] = (dailyUsage[dateStr] || 0) + 1;
        }
      });

    return Object.entries(dailyUsage)
      .map(([date, uses]) => ({ date, uses }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // 获取存储的数据
  private getStoredData(): ToolUsage[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse stored stats data:", error);
      return [];
    }
  }

  // 保存数据
  private saveData(data: ToolUsage[]) {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save stats data:", error);
    }
  }

  // 清除所有数据
  clearAllData() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.storageKey);
  }

  // 导出数据
  exportData() {
    const data = this.getStoredData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tion-work-stats-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// 创建单例实例
export const statsManager = new StatsManager();
