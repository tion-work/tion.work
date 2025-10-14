import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class TimestampConverterTool extends BaseTool {
  id = "timestamp-converter";
  name = "时间戳转换器";
  description = "时间戳与日期格式相互转换";
  category: ToolCategory = "utility";
  icon = "clock";
  color = "bg-orange-500";
  inputType: InputType = "text";
  outputType: OutputType = "text";
  inputLanguage = undefined;
  inputPlaceholder = "请输入时间戳或日期...";
  outputLanguage = undefined;
  initialInput = "1640995200000";
  options = [
    {
      name: "inputFormat",
      label: "输入格式",
      type: "select" as const,
      defaultValue: "auto",
      options: [
        { label: "自动检测", value: "auto" },
        { label: "时间戳（秒）", value: "timestamp" },
        { label: "时间戳（毫秒）", value: "timestamp_ms" },
        { label: "ISO 8601", value: "iso" },
        { label: "YYYY-MM-DD", value: "date" },
      ],
      description: "选择输入格式",
    },
    {
      name: "outputFormat",
      label: "输出格式",
      type: "select" as const,
      defaultValue: "iso",
      options: [
        { label: "ISO 8601", value: "iso" },
        { label: "时间戳（秒）", value: "timestamp" },
        { label: "时间戳（毫秒）", value: "timestamp_ms" },
        { label: "YYYY-MM-DD HH:mm:ss", value: "datetime" },
        { label: "YYYY-MM-DD", value: "date" },
      ],
      description: "选择输出格式",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "Timestamp Converter",
        description: "Convert between timestamps and date formats",
        inputPlaceholder: "Please enter timestamp or date...",
        options: [
          {
            name: "inputFormat",
            label: "Input Format",
            type: "select",
            defaultValue: "auto",
            description: "Choose input format",
            options: [
              { label: "Auto Detect", value: "auto" },
              { label: "Timestamp (seconds)", value: "timestamp" },
              { label: "Timestamp (milliseconds)", value: "timestamp_ms" },
              { label: "ISO 8601", value: "iso" },
              { label: "YYYY-MM-DD", value: "date" },
            ],
          },
          {
            name: "outputFormat",
            label: "Output Format",
            type: "select",
            defaultValue: "iso",
            description: "Choose output format",
            options: [
              { label: "ISO 8601", value: "iso" },
              { label: "Timestamp (seconds)", value: "timestamp" },
              { label: "Timestamp (milliseconds)", value: "timestamp_ms" },
              { label: "YYYY-MM-DD HH:mm:ss", value: "datetime" },
              { label: "YYYY-MM-DD", value: "date" },
            ],
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "タイムスタンプコンバーター",
        description: "タイムスタンプと日付形式の相互変換",
        inputPlaceholder: "タイムスタンプまたは日付を入力してください...",
        options: [
          {
            name: "inputFormat",
            label: "入力フォーマット",
            type: "select",
            defaultValue: "auto",
            description: "入力フォーマットを選択",
            options: [
              { label: "自動検出", value: "auto" },
              { label: "タイムスタンプ（秒）", value: "timestamp" },
              { label: "タイムスタンプ（ミリ秒）", value: "timestamp_ms" },
              { label: "ISO 8601", value: "iso" },
              { label: "YYYY-MM-DD", value: "date" },
            ],
          },
          {
            name: "outputFormat",
            label: "出力フォーマット",
            type: "select",
            defaultValue: "iso",
            description: "出力フォーマットを選択",
            options: [
              { label: "ISO 8601", value: "iso" },
              { label: "タイムスタンプ（秒）", value: "timestamp" },
              { label: "タイムスタンプ（ミリ秒）", value: "timestamp_ms" },
              { label: "YYYY-MM-DD HH:mm:ss", value: "datetime" },
              { label: "YYYY-MM-DD", value: "date" },
            ],
          },
        ],
      };
    }

    return {
      name: "时间戳转换器",
      description: "时间戳与日期格式相互转换",
      inputPlaceholder: "请输入时间戳或日期...",
      options: [
        {
          name: "inputFormat",
          label: "输入格式",
          type: "select",
          defaultValue: "auto",
          description: "选择输入格式",
          options: [
            { label: "自动检测", value: "auto" },
            { label: "时间戳（秒）", value: "timestamp" },
            { label: "时间戳（毫秒）", value: "timestamp_ms" },
            { label: "ISO 8601", value: "iso" },
            { label: "YYYY-MM-DD", value: "date" },
          ],
        },
        {
          name: "outputFormat",
          label: "输出格式",
          type: "select",
          defaultValue: "iso",
          description: "选择输出格式",
          options: [
            { label: "ISO 8601", value: "iso" },
            { label: "时间戳（秒）", value: "timestamp" },
            { label: "时间戳（毫秒）", value: "timestamp_ms" },
            { label: "YYYY-MM-DD HH:mm:ss", value: "datetime" },
            { label: "YYYY-MM-DD", value: "date" },
          ],
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { inputFormat = "auto", outputFormat = "iso" } = options;

    if (!input.trim()) {
      return "";
    }

    try {
      let date: Date;

      if (inputFormat === "auto") {
        // 自动检测格式
        if (/^\d{10}$/.test(input.trim())) {
          // 10位时间戳（秒）
          date = new Date(parseInt(input.trim()) * 1000);
        } else if (/^\d{13}$/.test(input.trim())) {
          // 13位时间戳（毫秒）
          date = new Date(parseInt(input.trim()));
        } else {
          // 尝试解析为日期字符串
          date = new Date(input.trim());
        }
      } else if (inputFormat === "timestamp") {
        date = new Date(parseInt(input.trim()) * 1000);
      } else if (inputFormat === "timestamp_ms") {
        date = new Date(parseInt(input.trim()));
      } else {
        date = new Date(input.trim());
      }

      if (isNaN(date.getTime())) {
        throw new Error("无效的日期格式");
      }

      // 根据输出格式格式化
      switch (outputFormat) {
        case "iso":
          return date.toISOString();
        case "timestamp":
          return Math.floor(date.getTime() / 1000).toString();
        case "timestamp_ms":
          return date.getTime().toString();
        case "datetime":
          return date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
        case "date":
          return date.toLocaleDateString("zh-CN");
        default:
          return date.toISOString();
      }
    } catch (error) {
      throw new Error(
        `转换失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      // 尝试解析输入
      if (/^\d{10}$/.test(input.trim()) || /^\d{13}$/.test(input.trim())) {
        return true;
      }

      const date = new Date(input.trim());
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }
}
