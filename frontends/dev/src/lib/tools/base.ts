import { InputType, OutputType, ToolCategory, ToolConfig } from "../../types";

export abstract class BaseTool {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract category: ToolCategory;
  abstract icon: string;
  abstract color: string;
  abstract options: any[];
  abstract inputType: InputType;
  abstract outputType: OutputType;
  abstract inputLanguage?: string;
  abstract inputPlaceholder?: string;
  abstract outputLanguage?: string;
  abstract initialInput?: string;

  // 多语言支持
  abstract getLocalizedContent(language: "zh" | "en" | "ja"): {
    name: string;
    description: string;
    inputPlaceholder?: string;
    options: Array<{
      name: string;
      label: string;
      description?: string;
      type: string;
      defaultValue: any;
      options?: Array<{ label: string; value: any }>;
    }>;
  };

  abstract process(
    input: string,
    options?: Record<string, any>
  ): Promise<string>;
  abstract validate(input: string): boolean;

  protected formatError(error: Error): string {
    return `处理失败: ${error.message}`;
  }

  protected formatSuccess(result: string): string {
    return result;
  }

  getConfig(): ToolConfig {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      icon: this.icon,
      options: this.options,
      inputType: this.inputType,
      outputType: this.outputType,
      processor: this.process.bind(this),
      validator: this.validate.bind(this),
    };
  }
}

export class ToolRegistry {
  private static tools: Map<string, BaseTool> = new Map();

  static register(tool: BaseTool): void {
    this.tools.set(tool.id, tool);
  }

  static get(id: string): BaseTool | undefined {
    return this.tools.get(id);
  }

  static getAll(): BaseTool[] {
    return Array.from(this.tools.values());
  }

  static getByCategory(category: ToolCategory): BaseTool[] {
    return this.getAll().filter((tool) => tool.category === category);
  }

  static search(
    query: string,
    language: "zh" | "en" | "ja" = "zh"
  ): BaseTool[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAll().filter((tool) => {
      const localizedContent = tool.getLocalizedContent(language);
      return (
        localizedContent.name.toLowerCase().includes(lowercaseQuery) ||
        localizedContent.description.toLowerCase().includes(lowercaseQuery)
      );
    });
  }
}
