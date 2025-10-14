import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class UUIDGeneratorTool extends BaseTool {
  id = "uuid-generator";
  name = "UUID Generator";
  description = "Generate UUIDs in various formats";
  category: ToolCategory = "utility";
  icon = "hash";
  color = "bg-indigo-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter number of UUIDs to generate...";
  outputLanguage = "text";
  initialInput = "5";
  options = [
    {
      name: "format",
      label: "Format",
      type: "select" as const,
      defaultValue: "uuid4",
      description: "Choose UUID format",
      options: [
        { label: "UUID v4 (Random)", value: "uuid4" },
        { label: "UUID v1 (Time-based)", value: "uuid1" },
        { label: "Short UUID", value: "short" },
        { label: "Numeric ID", value: "numeric" },
      ],
    },
    {
      name: "uppercase",
      label: "Uppercase",
      type: "boolean" as const,
      defaultValue: false,
      description: "Use uppercase letters",
    },
    {
      name: "hyphens",
      label: "Include Hyphens",
      type: "boolean" as const,
      defaultValue: true,
      description: "Include hyphens in UUID",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "UUID Generator",
        description: "Generate UUIDs in various formats",
        inputPlaceholder: "Enter number of UUIDs to generate...",
        options: [
          {
            name: "format",
            label: "Format",
            type: "select",
            defaultValue: "uuid4",
            description: "Choose UUID format",
            options: [
              { label: "UUID v4 (Random)", value: "uuid4" },
              { label: "UUID v1 (Time-based)", value: "uuid1" },
              { label: "Short UUID", value: "short" },
              { label: "Numeric ID", value: "numeric" },
            ],
          },
          {
            name: "uppercase",
            label: "Uppercase",
            type: "boolean",
            defaultValue: false,
            description: "Use uppercase letters",
          },
          {
            name: "hyphens",
            label: "Include Hyphens",
            type: "boolean",
            defaultValue: true,
            description: "Include hyphens in UUID",
          },
        ],
      };
    }

    return {
      name: "UUID 生成器",
      description: "生成各种格式的 UUID",
      inputPlaceholder: "请输入要生成的 UUID 数量...",
      options: [
        {
          name: "format",
          label: "格式",
          type: "select",
          defaultValue: "uuid4",
          description: "选择 UUID 格式",
          options: [
            { label: "UUID v4 (随机)", value: "uuid4" },
            { label: "UUID v1 (基于时间)", value: "uuid1" },
            { label: "短 UUID", value: "short" },
            { label: "数字 ID", value: "numeric" },
          ],
        },
        {
          name: "uppercase",
          label: "大写",
          type: "boolean",
          defaultValue: false,
          description: "使用大写字母",
        },
        {
          name: "hyphens",
          label: "包含连字符",
          type: "boolean",
          defaultValue: true,
          description: "在 UUID 中包含连字符",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { format = "uuid4", uppercase = false, hyphens = true } = options;

    const count = parseInt(input) || 1;
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      let uuid = "";

      switch (format) {
        case "uuid4":
          uuid = this.generateUUID4();
          break;
        case "uuid1":
          uuid = this.generateUUID1();
          break;
        case "short":
          uuid = this.generateShortUUID();
          break;
        case "numeric":
          uuid = this.generateNumericID();
          break;
        default:
          uuid = this.generateUUID4();
      }

      if (uppercase) {
        uuid = uuid.toUpperCase();
      }

      if (!hyphens && format !== "short" && format !== "numeric") {
        uuid = uuid.replace(/-/g, "");
      }

      results.push(uuid);
    }

    return results.join("\n");
  }

  private generateUUID4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generateUUID1(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 14);
    return `${timestamp.toString(16)}-${random.substring(
      0,
      4
    )}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(
      11
    )}`;
  }

  private generateShortUUID(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateNumericID(): string {
    return Math.floor(Math.random() * 1000000000).toString();
  }

  validate(input: string): boolean {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num <= 1000;
  }
}
