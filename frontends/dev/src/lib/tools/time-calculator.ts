import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class TimeCalculatorTool extends BaseTool {
  id = "time-calculator";
  name = "Time Calculator";
  description = "Calculate time differences and convert between time units";
  category: ToolCategory = "utility";
  icon = "clock";
  color = "bg-teal-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter time values (e.g., 2h 30m, 90 minutes)...";
  outputLanguage = "text";
  initialInput = "2h 30m";
  options = [
    {
      name: "operation",
      label: "Operation",
      type: "select" as const,
      defaultValue: "convert",
      description: "Choose operation",
      options: [
        { label: "Convert Units", value: "convert" },
        { label: "Add Time", value: "add" },
        { label: "Subtract Time", value: "subtract" },
        { label: "Calculate Difference", value: "difference" },
      ],
    },
    {
      name: "outputUnit",
      label: "Output Unit",
      type: "select" as const,
      defaultValue: "all",
      description: "Target unit",
      options: [
        { label: "All Units", value: "all" },
        { label: "Seconds", value: "seconds" },
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" },
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
        name: "Time Calculator",
        description:
          "Calculate time differences and convert between time units",
        inputPlaceholder: "Enter time values (e.g., 2h 30m, 90 minutes)...",
        options: [
          {
            name: "operation",
            label: "Operation",
            type: "select",
            defaultValue: "convert",
            description: "Choose operation",
            options: [
              { label: "Convert Units", value: "convert" },
              { label: "Add Time", value: "add" },
              { label: "Subtract Time", value: "subtract" },
              { label: "Calculate Difference", value: "difference" },
            ],
          },
          {
            name: "outputUnit",
            label: "Output Unit",
            type: "select",
            defaultValue: "all",
            description: "Target unit",
            options: [
              { label: "All Units", value: "all" },
              { label: "Seconds", value: "seconds" },
              { label: "Minutes", value: "minutes" },
              { label: "Hours", value: "hours" },
              { label: "Days", value: "days" },
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
      name: "时间计算器",
      description: "计算时间差并在时间单位之间转换",
      inputPlaceholder: "请输入时间值（例如：2h 30m, 90 minutes）...",
      options: [
        {
          name: "operation",
          label: "操作",
          type: "select",
          defaultValue: "convert",
          description: "选择操作",
          options: [
            { label: "转换单位", value: "convert" },
            { label: "时间相加", value: "add" },
            { label: "时间相减", value: "subtract" },
            { label: "计算差值", value: "difference" },
          ],
        },
        {
          name: "outputUnit",
          label: "输出单位",
          type: "select",
          defaultValue: "all",
          description: "目标单位",
          options: [
            { label: "所有单位", value: "all" },
            { label: "秒", value: "seconds" },
            { label: "分钟", value: "minutes" },
            { label: "小时", value: "hours" },
            { label: "天", value: "days" },
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
    const {
      operation = "convert",
      outputUnit = "all",
      precision = 2,
    } = options;

    if (!input.trim()) {
      return "Please provide time values to calculate.";
    }

    try {
      switch (operation) {
        case "convert":
          return this.convertTime(input, outputUnit, precision);
        case "add":
          return this.addTime(input, outputUnit, precision);
        case "subtract":
          return this.subtractTime(input, outputUnit, precision);
        case "difference":
          return this.calculateDifference(input, outputUnit, precision);
        default:
          return this.convertTime(input, outputUnit, precision);
      }
    } catch (error) {
      return `Error: ${
        error instanceof Error ? error.message : "Invalid input format"
      }`;
    }
  }

  private convertTime(
    input: string,
    outputUnit: string,
    precision: number
  ): string {
    const seconds = this.parseTimeToSeconds(input);

    if (outputUnit === "all") {
      return this.formatAllUnits(seconds, precision);
    } else {
      const converted = this.fromSeconds(seconds, outputUnit, precision);
      return `${converted} ${outputUnit}`;
    }
  }

  private addTime(
    input: string,
    outputUnit: string,
    precision: number
  ): string {
    // Expect format: "2h 30m + 1h 15m" or "90m + 45m"
    const parts = input.split("+").map((part) => part.trim());
    if (parts.length !== 2) {
      throw new Error("Please use format: 'time1 + time2'");
    }

    const seconds1 = this.parseTimeToSeconds(parts[0]);
    const seconds2 = this.parseTimeToSeconds(parts[1]);
    const totalSeconds = seconds1 + seconds2;

    if (outputUnit === "all") {
      return `Addition Result:\n${this.formatAllUnits(
        totalSeconds,
        precision
      )}`;
    } else {
      const converted = this.fromSeconds(totalSeconds, outputUnit, precision);
      return `${converted} ${outputUnit}`;
    }
  }

  private subtractTime(
    input: string,
    outputUnit: string,
    precision: number
  ): string {
    // Expect format: "2h 30m - 1h 15m" or "90m - 45m"
    const parts = input.split("-").map((part) => part.trim());
    if (parts.length !== 2) {
      throw new Error("Please use format: 'time1 - time2'");
    }

    const seconds1 = this.parseTimeToSeconds(parts[0]);
    const seconds2 = this.parseTimeToSeconds(parts[1]);
    const difference = Math.abs(seconds1 - seconds2);

    if (outputUnit === "all") {
      return `Subtraction Result:\n${this.formatAllUnits(
        difference,
        precision
      )}`;
    } else {
      const converted = this.fromSeconds(difference, outputUnit, precision);
      return `${converted} ${outputUnit}`;
    }
  }

  private calculateDifference(
    input: string,
    outputUnit: string,
    precision: number
  ): string {
    // Expect format: "9:00 AM - 5:30 PM" or "09:00 - 17:30"
    const parts = input.split("-").map((part) => part.trim());
    if (parts.length !== 2) {
      throw new Error("Please use format: 'start_time - end_time'");
    }

    const startTime = this.parseTimeString(parts[0]);
    const endTime = this.parseTimeString(parts[1]);
    const difference = Math.abs(endTime - startTime);

    if (outputUnit === "all") {
      return `Time Difference:\n${this.formatAllUnits(difference, precision)}`;
    } else {
      const converted = this.fromSeconds(difference, outputUnit, precision);
      return `${converted} ${outputUnit}`;
    }
  }

  private parseTimeToSeconds(input: string): number {
    const timeRegex =
      /(\d+(?:\.\d+)?)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?)/gi;
    let totalSeconds = 0;
    let match;

    while ((match = timeRegex.exec(input)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();

      switch (unit) {
        case "s":
        case "sec":
        case "second":
        case "seconds":
          totalSeconds += value;
          break;
        case "m":
        case "min":
        case "minute":
        case "minutes":
          totalSeconds += value * 60;
          break;
        case "h":
        case "hr":
        case "hour":
        case "hours":
          totalSeconds += value * 3600;
          break;
        case "d":
        case "day":
        case "days":
          totalSeconds += value * 86400;
          break;
      }
    }

    if (totalSeconds === 0) {
      // Try to parse as just a number (assume minutes)
      const num = parseFloat(input);
      if (!isNaN(num)) {
        totalSeconds = num * 60;
      } else {
        throw new Error("Invalid time format");
      }
    }

    return totalSeconds;
  }

  private parseTimeString(timeStr: string): number {
    // Parse time strings like "9:00 AM", "17:30", "9:00am"
    const timeRegex = /(\d{1,2}):(\d{2})\s*(am|pm)?/i;
    const match = timeStr.match(timeRegex);

    if (!match) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3]?.toLowerCase();

    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }

    return hours * 3600 + minutes * 60;
  }

  private fromSeconds(
    seconds: number,
    unit: string,
    precision: number
  ): number {
    const units: { [key: string]: number } = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
    };

    return parseFloat((seconds / (units[unit] || 1)).toFixed(precision));
  }

  private formatAllUnits(seconds: number, precision: number): string {
    const units = [
      { name: "Seconds", value: this.fromSeconds(seconds, "seconds", 0) },
      {
        name: "Minutes",
        value: this.fromSeconds(seconds, "minutes", precision),
      },
      { name: "Hours", value: this.fromSeconds(seconds, "hours", precision) },
      { name: "Days", value: this.fromSeconds(seconds, "days", precision) },
    ];

    let result = "Time Conversion:\n\n";

    units.forEach((unit) => {
      result += `${unit.name.padEnd(10)}: ${unit.value.toLocaleString()}\n`;
    });

    // Add human-readable format
    const humanReadable = this.getHumanReadableTime(seconds);
    result += `\nHuman Readable: ${humanReadable}`;

    return result;
  }

  private getHumanReadableTime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(" ") || "0s";
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    try {
      this.parseTimeToSeconds(input);
      return true;
    } catch {
      return false;
    }
  }
}
