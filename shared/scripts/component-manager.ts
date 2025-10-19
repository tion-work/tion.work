// 组件管理器 - 负责组件的创建、更新、删除和发布

import * as fs from "fs/promises";
import * as path from "path";
import {
  ComponentCategory,
  ComponentLibraryConfig,
  ComponentLibraryItem,
  ComponentSpec,
  ComponentStatus,
  GeneratedComponent,
} from "../types/component";
import { AIComponentGenerator } from "./component-generator";

export class ComponentManager {
  private generator: AIComponentGenerator;
  private componentsPath: string;
  private libraryConfig: ComponentLibraryConfig;

  constructor(
    componentsPath: string = "./shared/components",
    apiUrl: string = "http://localhost:8080"
  ) {
    this.generator = new AIComponentGenerator(apiUrl);
    this.componentsPath = componentsPath;
    this.libraryConfig = this.loadLibraryConfig();
  }

  // 创建新组件
  async createComponent(
    requirement: string,
    targetProject?: string
  ): Promise<GeneratedComponent> {
    console.log("🔍 分析需求...");
    const spec = await this.generator.analyzeRequirement(requirement);

    console.log("📝 生成组件代码...");
    const component = await this.generator.generateComponent(spec);

    console.log("💾 保存组件文件...");
    await this.saveComponent(component, targetProject);

    console.log("📚 更新组件库配置...");
    await this.updateLibraryConfig(component);

    console.log("✅ 组件创建完成!");
    return component;
  }

  // 保存组件文件
  private async saveComponent(
    component: GeneratedComponent,
    targetProject?: string
  ): Promise<void> {
    const componentDir = targetProject
      ? path.join(this.componentsPath, targetProject, component.name)
      : path.join(this.componentsPath, component.name);

    // 创建组件目录
    await fs.mkdir(componentDir, { recursive: true });

    // 保存各个文件
    const files = component.files;

    await fs.writeFile(
      path.join(componentDir, `${component.name}.tsx`),
      files.component
    );

    await fs.writeFile(
      path.join(componentDir, `${component.name}.test.tsx`),
      files.test
    );

    await fs.writeFile(
      path.join(componentDir, `${component.name}.stories.tsx`),
      files.story
    );

    await fs.writeFile(
      path.join(componentDir, `${component.name}.module.css`),
      files.styles
    );

    await fs.writeFile(path.join(componentDir, "README.md"), files.docs);

    await fs.writeFile(path.join(componentDir, "index.ts"), files.index);

    // 保存元数据
    await fs.writeFile(
      path.join(componentDir, "component.json"),
      JSON.stringify(component.metadata, null, 2)
    );
  }

  // 更新组件
  async updateComponent(
    componentName: string,
    updates: Partial<ComponentSpec>
  ): Promise<void> {
    const componentPath = path.join(this.componentsPath, componentName);
    const metadataPath = path.join(componentPath, "component.json");

    // 读取现有元数据
    const metadata = JSON.parse(await fs.readFile(metadataPath, "utf-8"));

    // 更新版本
    const newVersion = this.incrementVersion(metadata.version);
    metadata.version = newVersion;
    metadata.lastUpdated = new Date();
    metadata.changelog.unshift({
      version: newVersion,
      date: new Date(),
      changes: ["组件更新"],
      type: "feature",
    });

    // 重新生成组件
    const spec: ComponentSpec = {
      name: componentName,
      description: updates.description || metadata.description,
      category: updates.category || metadata.category,
      props: updates.props || metadata.props,
      events: updates.events || metadata.events,
      slots: updates.slots || metadata.slots,
      styles: updates.styles || metadata.styles,
      dependencies: updates.dependencies || metadata.dependencies,
      examples: updates.examples || metadata.examples,
    };

    const component = await this.generator.generateComponent(spec);
    component.metadata = metadata;

    // 保存更新后的组件
    await this.saveComponent(component);
    await this.updateLibraryConfig(component);
  }

  // 删除组件
  async deleteComponent(componentName: string): Promise<void> {
    const componentPath = path.join(this.componentsPath, componentName);

    // 删除组件目录
    await fs.rm(componentPath, { recursive: true, force: true });

    // 从库配置中移除
    this.libraryConfig.components = this.libraryConfig.components.filter(
      (comp) => comp.name !== componentName
    );

    await this.saveLibraryConfig();
  }

  // 发布组件
  async publishComponent(
    componentName: string,
    version?: string
  ): Promise<void> {
    const componentPath = path.join(this.componentsPath, componentName);
    const metadataPath = path.join(componentPath, "component.json");

    // 读取元数据
    const metadata = JSON.parse(await fs.readFile(metadataPath, "utf-8"));

    // 更新版本和状态
    if (version) {
      metadata.version = version;
    } else {
      metadata.version = this.incrementVersion(metadata.version);
    }

    metadata.status = ComponentStatus.STABLE;
    metadata.lastUpdated = new Date();

    // 保存元数据
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // 更新库配置
    const libraryItem = this.libraryConfig.components.find(
      (comp) => comp.name === componentName
    );
    if (libraryItem) {
      libraryItem.version = metadata.version;
      libraryItem.status = ComponentStatus.STABLE;
    }

    await this.saveLibraryConfig();

    console.log(`✅ 组件 ${componentName} v${metadata.version} 已发布!`);
  }

  // 列出所有组件
  async listComponents(): Promise<ComponentLibraryItem[]> {
    return this.libraryConfig.components;
  }

  // 获取组件信息
  async getComponent(
    componentName: string
  ): Promise<ComponentLibraryItem | null> {
    return (
      this.libraryConfig.components.find(
        (comp) => comp.name === componentName
      ) || null
    );
  }

  // 搜索组件
  async searchComponents(query: string): Promise<ComponentLibraryItem[]> {
    const lowerQuery = query.toLowerCase();
    return this.libraryConfig.components.filter(
      (comp) =>
        comp.name.toLowerCase().includes(lowerQuery) ||
        comp.category.toLowerCase().includes(lowerQuery)
    );
  }

  // 按分类获取组件
  async getComponentsByCategory(
    category: ComponentCategory
  ): Promise<ComponentLibraryItem[]> {
    return this.libraryConfig.components.filter(
      (comp) => comp.category === category
    );
  }

  // 生成组件库文档
  async generateLibraryDocs(): Promise<string> {
    let docs = `# ${this.libraryConfig.name}\n\n`;
    docs += `${this.libraryConfig.description}\n\n`;
    docs += `版本: ${this.libraryConfig.version}\n\n`;

    // 按分类组织组件
    const categories = Object.values(ComponentCategory);
    for (const category of categories) {
      const components = this.libraryConfig.components.filter(
        (comp) => comp.category === category
      );
      if (components.length > 0) {
        docs += `## ${
          category.charAt(0).toUpperCase() + category.slice(1)
        } 组件\n\n`;
        for (const comp of components) {
          docs += `- [${comp.name}](./${comp.name}/README.md) - v${comp.version} (${comp.status})\n`;
        }
        docs += "\n";
      }
    }

    return docs;
  }

  // 更新库配置
  private async updateLibraryConfig(
    component: GeneratedComponent
  ): Promise<void> {
    const existingIndex = this.libraryConfig.components.findIndex(
      (comp) => comp.name === component.name
    );

    const libraryItem: ComponentLibraryItem = {
      name: component.name,
      category: component.metadata.category || ComponentCategory.UTILITY,
      version: component.metadata.version,
      status: component.metadata.status,
      dependencies: component.metadata.dependencies || [],
      path: `./${component.name}`,
      exports: [component.name, `${component.name}Props`],
    };

    if (existingIndex >= 0) {
      this.libraryConfig.components[existingIndex] = libraryItem;
    } else {
      this.libraryConfig.components.push(libraryItem);
    }

    await this.saveLibraryConfig();
  }

  // 保存库配置
  private async saveLibraryConfig(): Promise<void> {
    const configPath = path.join(this.componentsPath, "library.json");
    await fs.writeFile(configPath, JSON.stringify(this.libraryConfig, null, 2));
  }

  // 加载库配置
  private loadLibraryConfig(): ComponentLibraryConfig {
    try {
      const configPath = path.join(this.componentsPath, "library.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config;
    } catch (error) {
      // 返回默认配置
      return {
        name: "Tion UI Components",
        version: "1.0.0",
        description: "AI 生成的 React 组件库",
        author: "Tion Team",
        license: "MIT",
        repository: "https://github.com/tion-work/tion.work",
        homepage: "https://tion.work",
        components: [],
        themes: [],
        build: {
          entry: "./index.ts",
          output: "./dist",
          format: "esm",
          minify: true,
          sourcemap: true,
          external: ["react", "react-dom"],
        },
      };
    }
  }

  // 增加版本号
  private incrementVersion(version: string): string {
    const parts = version.split(".").map(Number);
    parts[2] = (parts[2] || 0) + 1;
    return parts.join(".");
  }

  // 验证组件
  async validateComponent(
    componentName: string
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const componentPath = path.join(this.componentsPath, componentName);

    try {
      // 检查文件是否存在
      const requiredFiles = [
        `${componentName}.tsx`,
        `${componentName}.test.tsx`,
        `${componentName}.stories.tsx`,
        "index.ts",
        "component.json",
      ];

      for (const file of requiredFiles) {
        try {
          await fs.access(path.join(componentPath, file));
        } catch {
          errors.push(`缺少文件: ${file}`);
        }
      }

      // 检查 TypeScript 编译
      // 这里可以添加 TypeScript 编译检查

      // 检查测试覆盖率
      // 这里可以添加测试覆盖率检查
    } catch (error) {
      errors.push(`验证失败: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // 生成组件统计
  async generateStats(): Promise<any> {
    const components = this.libraryConfig.components;

    const stats = {
      total: components.length,
      byCategory: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byVersion: {} as Record<string, number>,
    };

    for (const comp of components) {
      // 按分类统计
      stats.byCategory[comp.category] =
        (stats.byCategory[comp.category] || 0) + 1;

      // 按状态统计
      stats.byStatus[comp.status] = (stats.byStatus[comp.status] || 0) + 1;

      // 按版本统计
      const majorVersion = comp.version.split(".")[0];
      stats.byVersion[majorVersion] = (stats.byVersion[majorVersion] || 0) + 1;
    }

    return stats;
  }
}
