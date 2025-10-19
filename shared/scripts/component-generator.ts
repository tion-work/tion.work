// AI 驱动的组件生成器

import {
  ComponentCategory,
  ComponentFiles,
  ComponentGenerator,
  ComponentMetadata,
  ComponentSpec,
  ComponentStatus,
  GeneratedComponent,
} from "../types/component";

export class AIComponentGenerator implements ComponentGenerator {
  private apiUrl: string;
  private templates: Map<string, string> = new Map();

  constructor(apiUrl: string = "http://localhost:8080") {
    this.apiUrl = apiUrl;
    this.loadTemplates();
  }

  // 从需求描述生成组件规格
  async analyzeRequirement(requirement: string): Promise<ComponentSpec> {
    const prompt = `作为前端组件设计专家，请分析以下需求并生成组件规格：

需求描述：${requirement}

请提供以下信息：
1. 组件名称（PascalCase）
2. 组件描述
3. 组件分类（display/form/layout/navigation/feedback/data/media/utility）
4. Props 定义（名称、类型、是否必需、默认值、描述）
5. Events 定义（事件名称、载荷类型、描述）
6. Slots 定义（插槽名称、描述、是否必需）
7. 样式变量定义
8. 使用示例

请以 JSON 格式返回结果。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      // 解析 AI 返回的 JSON
      const analysis = this.parseAnalysis(data.message || data.content);
      return this.convertToComponentSpec(analysis);
    } catch (error) {
      console.error("需求分析失败:", error);
      throw new Error("无法分析需求，请检查 AI 服务是否正常运行");
    }
  }

  // 生成完整组件
  async generateComponent(spec: ComponentSpec): Promise<GeneratedComponent> {
    const files: ComponentFiles = {
      component: await this.generateComponentFile(spec),
      test: await this.generateTests(spec),
      story: await this.generateStories(spec),
      styles: await this.generateStyles(spec),
      docs: await this.generateDocs(spec),
      index: this.generateIndexFile(spec),
    };

    const metadata: ComponentMetadata = {
      version: "1.0.0",
      status: ComponentStatus.DEVELOPMENT,
      lastUpdated: new Date(),
      maintainer: "AI Generator",
      changelog: [
        {
          version: "1.0.0",
          date: new Date(),
          changes: ["初始版本"],
          type: "feature",
        },
      ],
    };

    return {
      name: spec.name,
      files,
      metadata,
    };
  }

  // 生成组件主文件
  private async generateComponentFile(spec: ComponentSpec): Promise<string> {
    const prompt = `作为 React TypeScript 专家，请生成一个 ${spec.name} 组件。

组件规格：
${JSON.stringify(spec, null, 2)}

要求：
1. 使用 TypeScript 和 React Hooks
2. 使用 Tailwind CSS 进行样式设计
3. 遵循 React 最佳实践
4. 包含完整的类型定义
5. 支持所有定义的 Props、Events 和 Slots
6. 包含适当的错误处理
7. 添加 JSDoc 注释
8. 确保组件可访问性

请只返回组件代码，不要包含其他说明。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      return this.extractCodeFromResponse(data.message || data.content);
    } catch (error) {
      console.error("组件生成失败:", error);
      return this.generateFallbackComponent(spec);
    }
  }

  // 生成测试文件
  async generateTests(spec: ComponentSpec): Promise<string> {
    const prompt = `作为测试专家，请为 ${spec.name} 组件生成完整的测试文件。

组件规格：
${JSON.stringify(spec, null, 2)}

要求：
1. 使用 Jest 和 React Testing Library
2. 测试所有 Props 的渲染
3. 测试所有 Events 的触发
4. 测试所有 Slots 的渲染
5. 测试边界情况和错误处理
6. 测试可访问性
7. 测试用户交互
8. 确保测试覆盖率 > 80%

请只返回测试代码，不要包含其他说明。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      return this.extractCodeFromResponse(data.message || data.content);
    } catch (error) {
      console.error("测试生成失败:", error);
      return this.generateFallbackTests(spec);
    }
  }

  // 生成 Storybook 文件
  async generateStories(spec: ComponentSpec): Promise<string> {
    const prompt = `作为 Storybook 专家，请为 ${
      spec.name
    } 组件生成 Storybook 故事文件。

组件规格：
${JSON.stringify(spec, null, 2)}

要求：
1. 使用 Storybook 6+ 格式
2. 创建多个故事展示不同使用场景
3. 使用 Controls 插件展示 Props
4. 使用 Actions 插件展示 Events
5. 包含文档页面
6. 展示不同状态和变体
7. 包含可访问性测试

请只返回 Storybook 代码，不要包含其他说明。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      return this.extractCodeFromResponse(data.message || data.content);
    } catch (error) {
      console.error("Storybook 生成失败:", error);
      return this.generateFallbackStories(spec);
    }
  }

  // 生成样式文件
  async generateStyles(spec: ComponentSpec): Promise<string> {
    const prompt = `作为 CSS 专家，请为 ${spec.name} 组件生成样式文件。

组件规格：
${JSON.stringify(spec, null, 2)}

要求：
1. 使用 Tailwind CSS 类名
2. 定义 CSS 变量用于主题定制
3. 支持响应式设计
4. 包含暗色主题支持
5. 确保可访问性（颜色对比度等）
6. 使用现代 CSS 特性
7. 优化性能

请只返回样式代码，不要包含其他说明。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      return this.extractCodeFromResponse(data.message || data.content);
    } catch (error) {
      console.error("样式生成失败:", error);
      return this.generateFallbackStyles(spec);
    }
  }

  // 生成文档文件
  async generateDocs(spec: ComponentSpec): Promise<string> {
    const prompt = `作为技术文档专家，请为 ${spec.name} 组件生成完整的文档。

组件规格：
${JSON.stringify(spec, null, 2)}

要求：
1. 使用 Markdown 格式
2. 包含组件概述和用途
3. 详细的 API 文档（Props、Events、Slots）
4. 使用示例和代码片段
5. 设计指南和最佳实践
6. 可访问性指南
7. 常见问题和故障排除
8. 更新日志

请只返回文档内容，不要包含其他说明。`;

    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();
      return data.message || data.content || "";
    } catch (error) {
      console.error("文档生成失败:", error);
      return this.generateFallbackDocs(spec);
    }
  }

  // 生成导出文件
  private generateIndexFile(spec: ComponentSpec): string {
    return `export { ${spec.name} } from './${spec.name}';
export type { ${spec.name}Props } from './${spec.name}';
export * from './${spec.name}.types';
`;
  }

  // 解析 AI 分析结果
  private parseAnalysis(response: string): any {
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("无法找到有效的 JSON 数据");
    } catch (error) {
      console.error("解析分析结果失败:", error);
      return this.getDefaultAnalysis();
    }
  }

  // 转换为组件规格
  private convertToComponentSpec(analysis: any): ComponentSpec {
    return {
      name: analysis.name || "UnknownComponent",
      description: analysis.description || "A generated component",
      category: this.mapCategory(analysis.category),
      props: analysis.props || [],
      events: analysis.events || [],
      slots: analysis.slots || [],
      styles: analysis.styles || [],
      dependencies: analysis.dependencies || [],
      examples: analysis.examples || [],
    };
  }

  // 映射分类
  private mapCategory(category: string): ComponentCategory {
    const categoryMap: Record<string, ComponentCategory> = {
      display: ComponentCategory.DISPLAY,
      form: ComponentCategory.FORM,
      layout: ComponentCategory.LAYOUT,
      navigation: ComponentCategory.NAVIGATION,
      feedback: ComponentCategory.FEEDBACK,
      data: ComponentCategory.DATA,
      media: ComponentCategory.MEDIA,
      utility: ComponentCategory.UTILITY,
    };
    return categoryMap[category] || ComponentCategory.UTILITY;
  }

  // 从响应中提取代码
  private extractCodeFromResponse(response: string): string {
    // 尝试提取代码块
    const codeMatch = response.match(
      /```(?:tsx?|jsx?|typescript|javascript)?\n([\s\S]*?)\n```/
    );
    if (codeMatch) {
      return codeMatch[1];
    }

    // 如果没有代码块，返回整个响应
    return response;
  }

  // 加载模板
  private loadTemplates(): void {
    // 这里可以加载预定义的模板
    this.templates.set("component", this.getComponentTemplate());
    this.templates.set("test", this.getTestTemplate());
    this.templates.set("story", this.getStoryTemplate());
  }

  // 获取默认分析结果
  private getDefaultAnalysis(): any {
    return {
      name: "GeneratedComponent",
      description: "A generated component",
      category: "utility",
      props: [],
      events: [],
      slots: [],
      styles: [],
      dependencies: [],
      examples: [],
    };
  }

  // 生成备用组件
  private generateFallbackComponent(spec: ComponentSpec): string {
    return `import React from 'react';

export interface ${spec.name}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${spec.name}: React.FC<${spec.name}Props> = ({
  className = '',
  children
}) => {
  return (
    <div className={\`${spec.name.toLowerCase()} \${className}\`}>
      {children}
    </div>
  );
};

export default ${spec.name};
`;
  }

  // 生成备用测试
  private generateFallbackTests(spec: ComponentSpec): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${spec.name} } from './${spec.name}';

describe('${spec.name}', () => {
  it('renders without crashing', () => {
    render(<${spec.name} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(<${spec.name}>Test content</${spec.name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
`;
  }

  // 生成备用 Storybook
  private generateFallbackStories(spec: ComponentSpec): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${spec.name} } from './${spec.name}';

const meta: Meta<typeof ${spec.name}> = {
  title: 'Components/${spec.name}',
  component: ${spec.name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithChildren: Story = {
  args: {
    children: 'Test content',
  },
};
`;
  }

  // 生成备用样式
  private generateFallbackStyles(spec: ComponentSpec): string {
    return `.${spec.name.toLowerCase()} {
  /* 组件样式 */
}`;
  }

  // 生成备用文档
  private generateFallbackDocs(spec: ComponentSpec): string {
    return `# ${spec.name}

${spec.description}

## 用法

\`\`\`tsx
import { ${spec.name} } from './${spec.name}';

<${spec.name}>
  Content here
</${spec.name}>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |
`;
  }

  // 获取组件模板
  private getComponentTemplate(): string {
    return `import React from 'react';

export interface {{ComponentName}}Props {
  // Props 定义
}

export const {{ComponentName}}: React.FC<{{ComponentName}}Props> = (props) => {
  return (
    <div>
      {/* 组件实现 */}
    </div>
  );
};

export default {{ComponentName}};
`;
  }

  // 获取测试模板
  private getTestTemplate(): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { {{ComponentName}} } from './{{ComponentName}}';

describe('{{ComponentName}}', () => {
  it('renders without crashing', () => {
    render(<{{ComponentName}} />);
  });
});
`;
  }

  // 获取 Storybook 模板
  private getStoryTemplate(): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { {{ComponentName}} } from './{{ComponentName}}';

const meta: Meta<typeof {{ComponentName}}> = {
  title: 'Components/{{ComponentName}}',
  component: {{ComponentName}},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
  }
}
