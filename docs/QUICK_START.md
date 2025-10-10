# tion.work 快速启动指南

## 🚀 项目初始化

### 1. 环境要求
- Node.js 20+
- npm 9+ 或 yarn 1.22+
- Git
- Docker (可选)

### 2. 克隆项目
```bash
git clone https://github.com/tion-work/tion.work.git
cd tion.work
```

### 3. 安装依赖
```bash
# 前端依赖
cd frontend
npm install

# 后端依赖
cd ../backend
npm install
```

### 4. 环境配置
```bash
# 复制环境变量文件
cp .env.example .env.local

# 编辑环境变量
nano .env.local
```

### 5. 启动开发服务器
```bash
# 启动前端 (端口 3000)
cd frontend
npm run dev

# 启动后端 (端口 3001)
cd backend
npm run dev
```

## 🛠️ 开发工作流

### 1. 创建新工具
```bash
# 使用脚手架创建工具
npm run create:tool -- --name="json-formatter" --category="code"
```

### 2. 工具开发模板
```typescript
// src/tools/json-formatter/index.tsx
import { BaseTool } from '@/lib/tools/base';
import { CodeEditor } from '@/components/ui/code-editor';

export default function JsonFormatter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">输入 JSON</h2>
        <CodeEditor
          language="json"
          placeholder="请输入 JSON 数据..."
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">格式化结果</h2>
        <CodeEditor
          language="json"
          readOnly
          placeholder="格式化后的 JSON 将显示在这里..."
        />
      </div>
    </div>
  );
}
```

### 3. 工具注册
```typescript
// src/lib/tools/registry.ts
import { JsonFormatterTool } from './json-formatter';

export const toolRegistry = {
  'json-formatter': JsonFormatterTool,
  // 其他工具...
};
```

## 📁 项目结构

```
tion.work/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── tools/
│   │   │       ├── json-formatter/
│   │   │       │   └── page.tsx
│   │   │       └── base64-encoder/
│   │   │           └── page.tsx
│   │   ├── components/      # React 组件
│   │   │   ├── ui/         # 基础UI组件
│   │   │   ├── tools/      # 工具组件
│   │   │   └── layout/     # 布局组件
│   │   ├── lib/            # 工具函数
│   │   │   ├── utils.ts
│   │   │   ├── validators.ts
│   │   │   └── tools/      # 工具实现
│   │   │       ├── base.ts
│   │   │       ├── json-formatter.ts
│   │   │       └── registry.ts
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── stores/         # 状态管理
│   │   └── types/          # TypeScript 类型
│   ├── public/             # 静态资源
│   ├── package.json
│   └── next.config.js
├── backend/                 # Fastify 后端应用
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   │   ├── tools.ts
│   │   │   └── health.ts
│   │   ├── services/       # 业务逻辑
│   │   │   └── toolService.ts
│   │   ├── models/         # 数据模型
│   │   │   └── Tool.ts
│   │   ├── middleware/     # 中间件
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   └── utils/          # 工具函数
│   │       └── logger.ts
│   ├── migrations/         # 数据库迁移
│   ├── tests/              # 测试文件
│   ├── package.json
│   └── server.ts
├── docker/                 # Docker 配置
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── k8s/                    # Kubernetes 配置
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   └── service.yaml
├── docs/                   # 文档
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .github/                # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json           # 根目录 package.json
```

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行 E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

### 测试示例
```typescript
// tests/tools/json-formatter.test.ts
import { JsonFormatterTool } from '@/lib/tools/json-formatter';

describe('JsonFormatterTool', () => {
  const tool = new JsonFormatterTool();

  it('should format valid JSON', async () => {
    const input = '{"name":"test","value":123}';
    const result = await tool.process(input);
    expect(result).toContain('"name": "test"');
  });

  it('should handle invalid JSON', async () => {
    const input = 'invalid json';
    await expect(tool.process(input)).rejects.toThrow();
  });
});
```

## 🚀 部署

### 本地部署
```bash
# 构建项目
npm run build

# 启动生产服务器
npm run start
```

### Netlify 部署 (前端)
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 构建和部署
npm run build
netlify deploy --prod
```

### Railway 部署 (后端)
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署
railway up
```

### Docker 部署 (可选)
```bash
# 构建镜像
docker build -t tion-work .

# 运行容器
docker run -p 3000:3000 tion-work
```

## 📊 监控

### 查看日志
```bash
# 查看应用日志
kubectl logs -f deployment/tion-work-frontend
kubectl logs -f deployment/tion-work-backend

# 查看系统日志
journalctl -u tion-work
```

### 性能监控
- 访问 Grafana: http://localhost:3001
- 查看 Prometheus: http://localhost:9090
- Sentry 错误追踪: https://sentry.io

## 🔧 开发工具

### 推荐 VS Code 扩展
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

### 代码格式化
```bash
# 格式化代码
npm run format

# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix
```

## 🐛 常见问题

### Q: 端口被占用怎么办？
A: 修改 `.env.local` 中的端口配置，或使用 `lsof -ti:3000 | xargs kill -9` 杀死占用进程。

### Q: 数据库连接失败？
A: 检查数据库服务是否启动，确认连接配置是否正确。

### Q: 构建失败？
A: 删除 `node_modules` 和 `package-lock.json`，重新安装依赖。

### Q: 热重载不工作？
A: 检查文件监听配置，确保没有文件被忽略。

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Fastify 文档](https://www.fastify.io/docs/latest/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

---

*如有问题，请查看 [FAQ](FAQ.md) 或提交 [Issue](https://github.com/your-username/tion.work/issues)*
