import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class PasswordGeneratorTool extends BaseTool {
  id = "password-generator";
  name = "Password Generator";
  description = "生成安全的随机密码";
  category: ToolCategory = "security";
  icon = "shield";
  color = "bg-green-500";
  inputType: InputType = "none";
  outputType: OutputType = "text";
  inputLanguage = undefined;
  inputPlaceholder = undefined;
  outputLanguage = undefined;
  initialInput = "";

  options = [
    {
      name: "length",
      label: "密码长度",
      type: "number" as const,
      defaultValue: 12,
      description: "密码的字符数",
    },
    {
      name: "includeUppercase",
      label: "包含大写字母",
      type: "boolean" as const,
      defaultValue: true,
      description: "是否包含大写字母 A-Z",
    },
    {
      name: "includeLowercase",
      label: "包含小写字母",
      type: "boolean" as const,
      defaultValue: true,
      description: "是否包含小写字母 a-z",
    },
    {
      name: "includeNumbers",
      label: "包含数字",
      type: "boolean" as const,
      defaultValue: true,
      description: "是否包含数字 0-9",
    },
    {
      name: "includeSymbols",
      label: "包含特殊符号",
      type: "boolean" as const,
      defaultValue: true,
      description: "是否包含特殊符号 !@#$%^&*",
    },
    {
      name: "excludeSimilar",
      label: "排除相似字符",
      type: "boolean" as const,
      defaultValue: false,
      description: "排除容易混淆的字符如 0O1lI",
    },
    {
      name: "count",
      label: "生成数量",
      type: "number" as const,
      defaultValue: 1,
      description: "一次生成多少个密码",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "Password Generator",
        description: "Generate secure random passwords",
        options: [
          {
            name: "length",
            label: "Password Length",
            type: "number",
            defaultValue: 12,
            description: "Number of characters in the password",
          },
          {
            name: "includeUppercase",
            label: "Include Uppercase",
            type: "boolean",
            defaultValue: true,
            description: "Include uppercase letters A-Z",
          },
          {
            name: "includeLowercase",
            label: "Include Lowercase",
            type: "boolean",
            defaultValue: true,
            description: "Include lowercase letters a-z",
          },
          {
            name: "includeNumbers",
            label: "Include Numbers",
            type: "boolean",
            defaultValue: true,
            description: "Include numbers 0-9",
          },
          {
            name: "includeSymbols",
            label: "Include Symbols",
            type: "boolean",
            defaultValue: true,
            description: "Include special symbols !@#$%^&*",
          },
          {
            name: "excludeSimilar",
            label: "Exclude Similar",
            type: "boolean",
            defaultValue: false,
            description: "Exclude confusing characters like 0O1lI",
          },
          {
            name: "count",
            label: "Generate Count",
            type: "number",
            defaultValue: 1,
            description: "How many passwords to generate",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "パスワードジェネレーター",
        description: "安全なランダムパスワードを生成",
        options: [
          {
            name: "length",
            label: "パスワード長",
            type: "number",
            defaultValue: 12,
            description: "パスワードの文字数",
          },
          {
            name: "includeUppercase",
            label: "大文字を含む",
            type: "boolean",
            defaultValue: true,
            description: "大文字 A-Z を含む",
          },
          {
            name: "includeLowercase",
            label: "小文字を含む",
            type: "boolean",
            defaultValue: true,
            description: "小文字 a-z を含む",
          },
          {
            name: "includeNumbers",
            label: "数字を含む",
            type: "boolean",
            defaultValue: true,
            description: "数字 0-9 を含む",
          },
          {
            name: "includeSymbols",
            label: "記号を含む",
            type: "boolean",
            defaultValue: true,
            description: "特殊記号 !@#$%^&* を含む",
          },
          {
            name: "excludeSimilar",
            label: "類似文字を除外",
            type: "boolean",
            defaultValue: false,
            description: "0O1lI などの紛らわしい文字を除外",
          },
          {
            name: "count",
            label: "生成数",
            type: "number",
            defaultValue: 1,
            description: "一度に生成するパスワード数",
          },
        ],
      };
    }

    return {
      name: "密码生成器",
      description: "生成安全的随机密码",
      options: [
        {
          name: "length",
          label: "密码长度",
          type: "number",
          defaultValue: 12,
          description: "密码的字符数",
        },
        {
          name: "includeUppercase",
          label: "包含大写字母",
          type: "boolean",
          defaultValue: true,
          description: "是否包含大写字母 A-Z",
        },
        {
          name: "includeLowercase",
          label: "包含小写字母",
          type: "boolean",
          defaultValue: true,
          description: "是否包含小写字母 a-z",
        },
        {
          name: "includeNumbers",
          label: "包含数字",
          type: "boolean",
          defaultValue: true,
          description: "是否包含数字 0-9",
        },
        {
          name: "includeSymbols",
          label: "包含特殊符号",
          type: "boolean",
          defaultValue: true,
          description: "是否包含特殊符号 !@#$%^&*",
        },
        {
          name: "excludeSimilar",
          label: "排除相似字符",
          type: "boolean",
          defaultValue: false,
          description: "排除容易混淆的字符如 0O1lI",
        },
        {
          name: "count",
          label: "生成数量",
          type: "number",
          defaultValue: 1,
          description: "一次生成多少个密码",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const {
      length = 12,
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = false,
      count = 1,
    } = options;

    // 构建字符集
    let charset = "";
    if (includeUppercase) {
      charset += excludeSimilar
        ? "ABCDEFGHJKLMNPQRSTUVWXYZ"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (includeLowercase) {
      charset += excludeSimilar
        ? "abcdefghijkmnpqrstuvwxyz"
        : "abcdefghijklmnopqrstuvwxyz";
    }
    if (includeNumbers) {
      charset += excludeSimilar ? "23456789" : "0123456789";
    }
    if (includeSymbols) {
      charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (!charset) {
      throw new Error("至少需要选择一种字符类型");
    }

    // 生成密码
    const passwords: string[] = [];
    for (let i = 0; i < count; i++) {
      let password = "";
      for (let j = 0; j < length; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      passwords.push(password);
    }

    return passwords.join("\n");
  }

  validate(input: string): boolean {
    // 密码生成器不需要输入验证
    return true;
  }
}
