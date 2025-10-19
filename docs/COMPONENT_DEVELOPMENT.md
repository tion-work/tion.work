# 🧩 组件化开发指南

## 概述

本指南介绍如何使用 AI 驱动的组件化开发系统为 `frontends` 项目创建、管理和维护 React 组件。

## 🎯 核心特性

- **AI 驱动**: 通过自然语言描述生成组件代码
- **类型安全**: 完整的 TypeScript 支持
- **测试覆盖**: 自动生成测试用例
- **文档生成**: 自动生成组件文档
- **Storybook 集成**: 可视化组件开发
- **多项目支持**: 支持所有前端项目

## 🚀 快速开始

### 1. 创建组件

```bash
# 交互式创建组件
make component-interactive

# 直接创建组件
make component "创建一个用户头像组件"

# 为特定项目创建组件
make component-dev "创建一个数据表格组件"
```

### 2. 管理组件

```bash
# 列出所有组件
make component-list

# 查看组件信息
make component-info

# 运行组件测试
make component-test

# 构建组件库
make component-build
```

## 📁 项目结构

```
shared/
├── components/           # 共享组件库
│   ├── UserAvatar/      # 用户头像组件
│   │   ├── index.tsx    # 主组件文件
│   │   ├── UserAvatar.tsx
│   │   ├── UserAvatar.test.tsx
│   │   ├── UserAvatar.stories.tsx
│   │   ├── UserAvatar.module.css
│   │   ├── index.ts
│   │   ├── README.md
│   │   └── component.json
│   └── library.json     # 组件库配置
├── types/               # 类型定义
│   └── component.ts
└── scripts/             # 工具脚本
    ├── component-generator.ts
    └── component-manager.ts
```

## 🎨 组件分类

### Display 组件

用于展示内容的组件

- 头像、卡片、标签、徽章等

### Form 组件

用于表单交互的组件

- 输入框、选择器、按钮、验证器等

### Layout 组件

用于页面布局的组件

- 容器、网格、分割线、间距器等

### Navigation 组件

用于导航的组件

- 菜单、面包屑、分页、标签页等

### Feedback 组件

用于用户反馈的组件

- 提示、加载、进度条、对话框等

### Data 组件

用于数据展示的组件

- 表格、列表、图表、统计等

### Media 组件

用于媒体内容的组件

- 图片、视频、音频、画廊等

### Utility 组件

工具类组件

- 图标、工具提示、遮罩、滚动等

## 🛠️ 开发流程

### 1. 需求分析

通过自然语言描述组件需求，AI 会自动分析并生成组件规格。

### 2. 代码生成

AI 根据分析结果生成：

- TypeScript 组件代码
- 测试文件
- Storybook 故事
- 样式文件
- 文档文件

### 3. 测试验证

自动运行测试确保组件质量：

- 单元测试
- 集成测试
- 可访问性测试

### 4. 文档生成

自动生成完整的组件文档：

- API 文档
- 使用示例
- 设计指南

## 📝 组件规范

### 命名规范

```typescript
// 组件名称使用 PascalCase
UserAvatar;
DataTable;
NavigationMenu;

// 文件名使用 kebab-case
user - avatar.tsx;
data - table.tsx;
navigation - menu.tsx;
```

### Props 定义

```typescript
export interface UserAvatarProps {
  src: string; // 图片源
  alt: string; // 替代文本
  size?: "sm" | "md" | "lg"; // 尺寸
  shape?: "circle" | "square"; // 形状
  onlineStatus?: boolean; // 在线状态
  onClick?: () => void; // 点击事件
  className?: string; // 自定义类名
}
```

### 样式规范

```css
/* 使用 CSS 变量 */
.user-avatar {
  --avatar-size: var(--size-md, 40px);
  --avatar-border-radius: var(--border-radius-full, 50%);

  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: var(--avatar-border-radius);
}
```

### 测试规范

```typescript
describe("UserAvatar", () => {
  it("renders with correct props", () => {
    render(<UserAvatar src="test.jpg" alt="Test" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<UserAvatar onClick={handleClick} />);
    fireEvent.click(screen.getByRole("img"));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 🔧 高级功能

### 组件继承

```typescript
// 基础组件
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 扩展组件
export interface UserAvatarProps extends BaseComponentProps {
  src: string;
  alt: string;
}
```

### 主题支持

```typescript
// 主题变量
const theme = {
  colors: {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
  },
  spacing: {
    sm: "var(--spacing-sm)",
    md: "var(--spacing-md)",
  },
};
```

### 国际化支持

```typescript
// 多语言支持
const messages = {
  en: { loading: "Loading..." },
  zh: { loading: "加载中..." },
  ja: { loading: "読み込み中..." },
};
```

## 📊 质量保证

### 代码质量

- ESLint 检查
- TypeScript 类型检查
- Prettier 格式化

### 测试覆盖

- 单元测试覆盖率 > 80%
- 集成测试
- 视觉回归测试

### 性能优化

- 组件懒加载
- 内存泄漏检查
- 渲染性能优化

### 可访问性

- ARIA 属性
- 键盘导航
- 屏幕阅读器支持

## 🚀 部署流程

### 开发环境

```bash
# 创建组件
make component "创建一个按钮组件"

# 运行测试
make component-test

# 启动开发服务器
make dev
```

### 生产环境

```bash
# 构建组件库
make component-build

# 发布组件库
make component-publish

# 部署到生产环境
make deploy-all
```

## 🔍 故障排除

### 常见问题

**Q: 组件生成失败**
A: 检查后端服务是否运行，运行 `make backend` 启动服务

**Q: 测试失败**
A: 检查依赖是否正确安装，运行 `make install` 安装依赖

**Q: 样式不生效**
A: 检查 Tailwind CSS 配置，确保样式文件正确导入

**Q: TypeScript 错误**
A: 检查类型定义，运行 `make check` 检查类型

### 调试技巧

```bash
# 查看详细日志
make component -v

# 检查组件状态
make component-info

# 运行特定测试
npm test -- --testNamePattern="UserAvatar"
```

## 📚 最佳实践

### 1. 组件设计

- 单一职责原则
- 可复用性
- 可配置性
- 可扩展性

### 2. 性能优化

- 使用 React.memo
- 避免不必要的重渲染
- 懒加载大型组件

### 3. 用户体验

- 加载状态
- 错误处理
- 无障碍支持

### 4. 代码质量

- 清晰的命名
- 完整的注释
- 充分的测试

## 🎯 下一步

1. **探索现有组件**: 查看 `shared/components` 目录
2. **创建第一个组件**: 运行 `make component-interactive`
3. **学习最佳实践**: 阅读组件文档
4. **贡献组件**: 提交 Pull Request

## 📞 支持

如有问题或建议，请：

1. 查看本文档
2. 检查 GitHub Issues
3. 联系开发团队

---

**Happy Coding! 🎉**
