import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class LoremGeneratorTool extends BaseTool {
  id = "lorem-generator";
  name = "Lorem Ipsum Generator";
  description = "Generate Lorem Ipsum placeholder text";
  category: ToolCategory = "text";
  icon = "type";
  color = "bg-orange-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter number of paragraphs...";
  outputLanguage = "text";
  initialInput = "3";
  options = [
    {
      name: "type",
      label: "Type",
      type: "select" as const,
      defaultValue: "paragraphs",
      description: "Choose text type",
      options: [
        { label: "Paragraphs", value: "paragraphs" },
        { label: "Sentences", value: "sentences" },
        { label: "Words", value: "words" },
        { label: "Characters", value: "characters" },
      ],
    },
    {
      name: "startWithLorem",
      label: "Start with Lorem",
      type: "boolean" as const,
      defaultValue: true,
      description: "Start with 'Lorem ipsum dolor sit amet'",
    },
    {
      name: "language",
      label: "Language",
      type: "select" as const,
      defaultValue: "latin",
      description: "Choose language",
      options: [
        { label: "Latin", value: "latin" },
        { label: "English", value: "english" },
        { label: "Chinese", value: "chinese" },
      ],
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "Lorem Ipsum Generator",
        description: "Generate Lorem Ipsum placeholder text",
        inputPlaceholder: "Enter number of paragraphs...",
        options: [
          {
            name: "type",
            label: "Type",
            type: "select",
            defaultValue: "paragraphs",
            description: "Choose text type",
            options: [
              { label: "Paragraphs", value: "paragraphs" },
              { label: "Sentences", value: "sentences" },
              { label: "Words", value: "words" },
              { label: "Characters", value: "characters" },
            ],
          },
          {
            name: "startWithLorem",
            label: "Start with Lorem",
            type: "boolean",
            defaultValue: true,
            description: "Start with 'Lorem ipsum dolor sit amet'",
          },
          {
            name: "language",
            label: "Language",
            type: "select",
            defaultValue: "latin",
            description: "Choose language",
            options: [
              { label: "Latin", value: "latin" },
              { label: "English", value: "english" },
              { label: "Chinese", value: "chinese" },
            ],
          },
        ],
      };
    }

    return {
      name: "Lorem Ipsum 生成器",
      description: "生成 Lorem Ipsum 占位符文本",
      inputPlaceholder: "请输入段落数量...",
      options: [
        {
          name: "type",
          label: "类型",
          type: "select",
          defaultValue: "paragraphs",
          description: "选择文本类型",
          options: [
            { label: "段落", value: "paragraphs" },
            { label: "句子", value: "sentences" },
            { label: "单词", value: "words" },
            { label: "字符", value: "characters" },
          ],
        },
        {
          name: "startWithLorem",
          label: "以 Lorem 开始",
          type: "boolean",
          defaultValue: true,
          description: "以 'Lorem ipsum dolor sit amet' 开始",
        },
        {
          name: "language",
          label: "语言",
          type: "select",
          defaultValue: "latin",
          description: "选择语言",
          options: [
            { label: "拉丁语", value: "latin" },
            { label: "英语", value: "english" },
            { label: "中文", value: "chinese" },
          ],
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const {
      type = "paragraphs",
      startWithLorem = true,
      language = "latin",
    } = options;

    const count = parseInt(input) || 1;

    const latinWords = [
      "lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
      "aliqua",
      "enim",
      "ad",
      "minim",
      "veniam",
      "quis",
      "nostrud",
      "exercitation",
      "ullamco",
      "laboris",
      "nisi",
      "aliquip",
      "ex",
      "ea",
      "commodo",
      "consequat",
      "duis",
      "aute",
      "irure",
      "in",
      "reprehenderit",
      "voluptate",
      "velit",
      "esse",
      "cillum",
      "fugiat",
      "nulla",
      "pariatur",
      "excepteur",
      "sint",
      "occaecat",
      "cupidatat",
      "non",
      "proident",
      "sunt",
      "culpa",
      "qui",
      "officia",
      "deserunt",
      "mollit",
      "anim",
      "id",
      "est",
      "laborum",
    ];

    const englishWords = [
      "the",
      "quick",
      "brown",
      "fox",
      "jumps",
      "over",
      "lazy",
      "dog",
      "pack",
      "my",
      "box",
      "with",
      "five",
      "dozen",
      "liquor",
      "jugs",
      "how",
      "vexingly",
      "quick",
      "daft",
      "zebras",
      "jump",
      "waltz",
      "bad",
      "nymph",
      "for",
      "jived",
      "quicks",
      "sphinx",
      "of",
      "black",
      "quartz",
      "judge",
      "my",
      "vow",
      "amazingly",
      "few",
      "discotheques",
      "provide",
      "jukeboxes",
      "when",
      "zombies",
      "arrive",
      "quickly",
      "fax",
      "judge",
      "pat",
      "amazingly",
      "few",
      "discotheques",
      "provide",
      "jukeboxes",
    ];

    const chineseWords = [
      "这是一个",
      "测试文本",
      "用于演示",
      "中文内容",
      "生成功能",
      "包含各种",
      "常用词汇",
      "和短语",
      "帮助用户",
      "快速生成",
      "中文占位符",
      "文本内容",
      "可以用于",
      "设计稿",
      "和原型",
      "展示效果",
      "非常实用",
      "的工具",
    ];

    let words: string[];
    switch (language) {
      case "english":
        words = englishWords;
        break;
      case "chinese":
        words = chineseWords;
        break;
      default:
        words = latinWords;
    }

    let result = "";

    if (type === "paragraphs") {
      for (let i = 0; i < count; i++) {
        if (i > 0) result += "\n\n";

        if (startWithLorem && i === 0 && language === "latin") {
          result += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        }

        const sentenceCount = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < sentenceCount; j++) {
          const wordCount = Math.floor(Math.random() * 8) + 8;
          const sentence = this.generateSentence(words, wordCount);
          result += sentence;
          if (j < sentenceCount - 1) result += " ";
        }
      }
    } else if (type === "sentences") {
      for (let i = 0; i < count; i++) {
        if (i > 0) result += " ";
        const wordCount = Math.floor(Math.random() * 8) + 8;
        result += this.generateSentence(words, wordCount);
      }
    } else if (type === "words") {
      for (let i = 0; i < count; i++) {
        if (i > 0) result += " ";
        result += words[Math.floor(Math.random() * words.length)];
      }
    } else if (type === "characters") {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      for (let i = 0; i < count; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return result;
  }

  private generateSentence(words: string[], wordCount: number): string {
    let sentence = "";
    for (let i = 0; i < wordCount; i++) {
      if (i > 0) sentence += " ";
      sentence += words[Math.floor(Math.random() * words.length)];
    }
    sentence += ".";
    return sentence;
  }

  validate(input: string): boolean {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num <= 100;
  }
}
