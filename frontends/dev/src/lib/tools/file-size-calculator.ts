import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class FileSizeCalculatorTool extends BaseTool {
  id = "file-size-calculator";
  name = "File Size Calculator";
  description = "Calculate file sizes and convert between units";
  category: ToolCategory = "utility";
  icon = "file";
  color = "bg-cyan-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter file size (e.g., 1024, 1KB, 2MB)...";
  outputLanguage = "text";
  initialInput = "1024";
  options = [
    {
      name: "fromUnit",
      label: "From Unit",
      type: "select" as const,
      defaultValue: "bytes",
      description: "Source unit",
      options: [
        { label: "Bytes", value: "bytes" },
        { label: "KB", value: "kb" },
        { label: "MB", value: "mb" },
        { label: "GB", value: "gb" },
        { label: "TB", value: "tb" },
      ],
    },
    {
      name: "toUnit",
      label: "To Unit",
      type: "select" as const,
      defaultValue: "all",
      description: "Target unit",
      options: [
        { label: "All Units", value: "all" },
        { label: "Bytes", value: "bytes" },
        { label: "KB", value: "kb" },
        { label: "MB", value: "mb" },
        { label: "GB", value: "gb" },
        { label: "TB", value: "tb" },
      ],
    },
    {
      name: "precision",
      label: "Precision",
      type: "number" as const,
      defaultValue: 2,
      description: "Decimal places",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "File Size Calculator",
        description: "Calculate file sizes and convert between units",
        inputPlaceholder: "Enter file size (e.g., 1024, 1KB, 2MB)...",
        options: [
          {
            name: "fromUnit",
            label: "From Unit",
            type: "select",
            defaultValue: "bytes",
            description: "Source unit",
            options: [
              { label: "Bytes", value: "bytes" },
              { label: "KB", value: "kb" },
              { label: "MB", value: "mb" },
              { label: "GB", value: "gb" },
              { label: "TB", value: "tb" },
            ],
          },
          {
            name: "toUnit",
            label: "To Unit",
            type: "select",
            defaultValue: "all",
            description: "Target unit",
            options: [
              { label: "All Units", value: "all" },
              { label: "Bytes", value: "bytes" },
              { label: "KB", value: "kb" },
              { label: "MB", value: "mb" },
              { label: "GB", value: "gb" },
              { label: "TB", value: "tb" },
            ],
          },
          {
            name: "precision",
            label: "Precision",
            type: "number",
            defaultValue: 2,
            description: "Decimal places",
          },
        ],
      };
    }

    return {
      name: "文件大小计算器",
      description: "计算文件大小并在单位之间转换",
      inputPlaceholder: "请输入文件大小（例如：1024, 1KB, 2MB）...",
      options: [
        {
          name: "fromUnit",
          label: "源单位",
          type: "select",
          defaultValue: "bytes",
          description: "源单位",
          options: [
            { label: "字节", value: "bytes" },
            { label: "KB", value: "kb" },
            { label: "MB", value: "mb" },
            { label: "GB", value: "gb" },
            { label: "TB", value: "tb" },
          ],
        },
        {
          name: "toUnit",
          label: "目标单位",
          type: "select",
          defaultValue: "all",
          description: "目标单位",
          options: [
            { label: "所有单位", value: "all" },
            { label: "字节", value: "bytes" },
            { label: "KB", value: "kb" },
            { label: "MB", value: "mb" },
            { label: "GB", value: "gb" },
            { label: "TB", value: "tb" },
          ],
        },
        {
          name: "precision",
          label: "精度",
          type: "number",
          defaultValue: 2,
          description: "小数位数",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { fromUnit = "bytes", toUnit = "all", precision = 2 } = options;

    if (!input.trim()) {
      return "Please provide a file size to calculate.";
    }

    // Parse input - try to extract number and unit
    const parsed = this.parseInput(input);
    if (!parsed) {
      return "Invalid input format. Please enter a number with optional unit (e.g., 1024, 1KB, 2MB).";
    }

    const { value, unit } = parsed;
    const bytes = this.toBytes(value, unit);

    if (toUnit === "all") {
      return this.formatAllUnits(bytes, precision);
    } else {
      const converted = this.fromBytes(bytes, toUnit, precision);
      return `${converted} ${toUnit.toUpperCase()}`;
    }
  }

  private parseInput(input: string): { value: number; unit: string } | null {
    const trimmed = input.trim().toUpperCase();

    // Try to match patterns like "1024", "1KB", "2.5MB", etc.
    const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(BYTES?|KB|MB|GB|TB)?$/);

    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2] || "BYTES";

    return { value, unit: unit.toLowerCase() };
  }

  private toBytes(value: number, unit: string): number {
    const units: { [key: string]: number } = {
      bytes: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
      tb: 1024 * 1024 * 1024 * 1024,
    };

    return value * (units[unit] || 1);
  }

  private fromBytes(bytes: number, unit: string, precision: number): number {
    const units: { [key: string]: number } = {
      bytes: 1,
      kb: 1024,
      mb: 1024 * 1024,
      gb: 1024 * 1024 * 1024,
      tb: 1024 * 1024 * 1024 * 1024,
    };

    return parseFloat((bytes / (units[unit] || 1)).toFixed(precision));
  }

  private formatAllUnits(bytes: number, precision: number): string {
    const units = [
      { name: "Bytes", value: this.fromBytes(bytes, "bytes", 0) },
      { name: "KB", value: this.fromBytes(bytes, "kb", precision) },
      { name: "MB", value: this.fromBytes(bytes, "mb", precision) },
      { name: "GB", value: this.fromBytes(bytes, "gb", precision) },
      { name: "TB", value: this.fromBytes(bytes, "tb", precision) },
    ];

    let result = "File Size Conversion:\n\n";

    units.forEach((unit) => {
      result += `${unit.name.padEnd(8)}: ${unit.value.toLocaleString()}\n`;
    });

    // Add human-readable format
    const humanReadable = this.getHumanReadableSize(bytes);
    result += `\nHuman Readable: ${humanReadable}`;

    // Add some context
    result += `\n\nContext:\n`;
    if (bytes < 1024) {
      result += `• Very small file (text document)\n`;
    } else if (bytes < 1024 * 1024) {
      result += `• Small file (image, document)\n`;
    } else if (bytes < 1024 * 1024 * 100) {
      result += `• Medium file (high-res image, video)\n`;
    } else if (bytes < 1024 * 1024 * 1024) {
      result += `• Large file (HD video, software)\n`;
    } else {
      result += `• Very large file (database, archive)\n`;
    }

    return result;
  }

  private getHumanReadableSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    const parsed = this.parseInput(input);
    return parsed !== null && parsed.value > 0;
  }
}
