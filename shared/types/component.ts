// 组件开发相关类型定义

export interface ComponentSpec {
  name: string;
  description: string;
  category: ComponentCategory;
  props: PropDefinition[];
  events: EventDefinition[];
  slots: SlotDefinition[];
  styles: StyleDefinition[];
  dependencies: string[];
  examples: ComponentExample[];
}

export interface PropDefinition {
  name: string;
  type: PropType;
  required: boolean;
  defaultValue?: any;
  description: string;
  validation?: ValidationRule[];
}

export interface EventDefinition {
  name: string;
  payload: any;
  description: string;
}

export interface SlotDefinition {
  name: string;
  description: string;
  required: boolean;
}

export interface StyleDefinition {
  name: string;
  type: "css" | "scss" | "styled-components";
  variables: StyleVariable[];
}

export interface StyleVariable {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
  props: Record<string, any>;
}

export interface GeneratedComponent {
  name: string;
  files: ComponentFiles;
  metadata: ComponentMetadata;
}

export interface ComponentFiles {
  component: string; // 主组件文件
  test: string; // 测试文件
  story: string; // Storybook 文件
  styles: string; // 样式文件
  docs: string; // 文档文件
  index: string; // 导出文件
}

export interface ComponentMetadata {
  version: string;
  status: ComponentStatus;
  lastUpdated: Date;
  maintainer: string;
  changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: string[];
  type: "feature" | "bugfix" | "breaking" | "deprecated";
}

export enum ComponentCategory {
  DISPLAY = "display",
  FORM = "form",
  LAYOUT = "layout",
  NAVIGATION = "navigation",
  FEEDBACK = "feedback",
  DATA = "data",
  MEDIA = "media",
  UTILITY = "utility",
}

export enum ComponentStatus {
  DRAFT = "draft",
  DEVELOPMENT = "development",
  TESTING = "testing",
  BETA = "beta",
  STABLE = "stable",
  DEPRECATED = "deprecated",
}

export enum PropType {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  ARRAY = "array",
  OBJECT = "object",
  FUNCTION = "function",
  ELEMENT = "element",
  UNION = "union",
  LITERAL = "literal",
}

export interface ValidationRule {
  type: "required" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
}

// 组件生成器接口
export interface ComponentGenerator {
  generateComponent(spec: ComponentSpec): Promise<GeneratedComponent>;
  generateTests(component: ComponentSpec): Promise<string>;
  generateStories(component: ComponentSpec): Promise<string>;
  generateDocs(component: ComponentSpec): Promise<string>;
  generateStyles(component: ComponentSpec): Promise<string>;
}

// AI 组件分析结果
export interface ComponentAnalysis {
  name: string;
  description: string;
  category: ComponentCategory;
  complexity: "simple" | "medium" | "complex";
  estimatedTime: number; // 预估开发时间（小时）
  dependencies: string[];
  suggestedProps: PropDefinition[];
  suggestedEvents: EventDefinition[];
  suggestedSlots: SlotDefinition[];
  designPatterns: string[];
  accessibility: AccessibilityRequirement[];
}

export interface AccessibilityRequirement {
  type: "keyboard" | "screen-reader" | "color-contrast" | "focus" | "aria";
  description: string;
  implementation: string;
}

// 组件库配置
export interface ComponentLibraryConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repository: string;
  homepage: string;
  components: ComponentLibraryItem[];
  themes: ThemeConfig[];
  build: BuildConfig;
}

export interface ComponentLibraryItem {
  name: string;
  category: ComponentCategory;
  version: string;
  status: ComponentStatus;
  dependencies: string[];
  path: string;
  exports: string[];
}

export interface ThemeConfig {
  name: string;
  variables: Record<string, string>;
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
}

export interface BuildConfig {
  entry: string;
  output: string;
  format: "esm" | "cjs" | "umd";
  minify: boolean;
  sourcemap: boolean;
  external: string[];
}
