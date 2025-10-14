# tion.work 快速开始指南

## 🚀 5 分钟快速启动

### 前置条件

1. **Node.js** >= 18.18.0
2. **npm** >= 9.0.0 或 **yarn** >= 1.22.0
3. **Docker** (可选，用于后端)
4. **PostgreSQL** (后端需要)
5. **Redis** (后端需要)

### 步骤 1: 克隆项目

```bash
git clone <repository-url>
cd tion.work
```

### 步骤 2: 安装依赖

```bash
make install
```

这会自动安装：

- 前端依赖 (使用 yarn)
- 后端依赖 (使用 npm)

### 步骤 3: 配置环境变量

```bash
cp env.example .env
```

编辑 `.env` 文件，设置数据库和 Redis 连接信息：

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/tion_work
REDIS_URL=redis://localhost:6379/0
```

### 步骤 4: 启动服务

#### 选项 A: 使用 Docker 启动后端 (推荐)

```bash
# 终端 1: 启动后端 (Docker)
make dev-docker

# 终端 2: 启动前端
make dev-frontend
```

#### 选项 B: 本地启动

```bash
# 终端 1: 启动后端
make dev-backend

# 终端 2: 启动前端
make dev-frontend
```

### 步骤 5: 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:3001
- API 文档: http://localhost:3001/docs

## 📚 常用命令

### 开发

```bash
# 启动前端开发服务器
make dev-frontend

# 启动后端开发服务器 (本地)
make dev-backend

# 启动后端开发服务器 (Docker)
make dev-docker

# 同时启动前端和后端 (本地)
make dev
```

### 构建

```bash
# 构建前端
make build-frontend

# 构建后端
make build-backend

# 构建所有
make build
```

### 测试

```bash
# 运行前端测试
make test-frontend

# 运行后端测试
make test-backend

# 运行所有测试
make test
```

### 代码检查

```bash
# 检查前端代码
cd frontend && npm run lint

# 检查后端代码
cd backend && go vet ./...

# 修复代码格式
make lint-fix
```

### Docker

```bash
# 启动 Docker 服务
make docker-up

# 停止 Docker 服务
make docker-down

# 查看 Docker 日志
make docker-logs
```

### 清理

```bash
# 清理构建文件和依赖
make clean
```

## 🛠️ 项目结构

```
tion.work/
├── frontend/              # Next.js 前端应用
│   ├── src/
│   │   ├── app/          # Next.js App Router 页面
│   │   ├── components/   # React 组件
│   │   ├── lib/          # 工具函数和 API
│   │   ├── stores/       # Zustand 状态管理
│   │   └── types/        # TypeScript 类型定义
│   ├── public/           # 静态资源
│   └── package.json
│
├── backend/               # Fastify 后端 API
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑
│   │   ├── lib/          # 工具函数
│   │   ├── database/     # 数据库配置
│   │   └── server.ts     # 服务器入口
│   ├── docker-compose.yml # Docker 配置
│   └── package.json
│
├── docs/                  # 文档
├── Makefile              # 项目管理脚本
├── env.example           # 环境变量示例
└── README.md
```

## 🎯 核心功能

### 已实现的工具

1. **JSON Formatter** - JSON 格式化和验证
2. **Base64 Encoder/Decoder** - Base64 编解码
3. **Password Generator** - 安全密码生成
4. **Timestamp Converter** - Unix 时间戳转换
5. **QR Code Generator** - 二维码生成
6. **URL Encoder/Decoder** - URL 编解码
7. **Hash Generator** - MD5/SHA 哈希生成

### API 端点

- `GET /api/health` - 健康检查
- `GET /api/tools` - 获取工具列表
- `GET /api/tools/:id` - 获取工具详情
- `POST /api/tools/:id/process` - 处理工具请求
- `GET /api/search` - 搜索工具
- `GET /api/categories` - 获取分类
- `GET /api/tools/popular` - 热门工具
- `POST /api/feedback` - 提交反馈

## 🐛 故障排除

### 前端问题

#### 依赖安装失败

```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

#### 端口被占用

```bash
# 查找占用 3000 端口的进程
lsof -ti:3000

# 杀死进程
kill -9 <PID>
```

### 后端问题

#### 数据库连接失败

检查 PostgreSQL 是否运行：

```bash
# macOS
brew services list | grep postgresql

# Linux
systemctl status postgresql
```

检查连接字符串是否正确：

```env
DATABASE_URL=postgres://用户名:密码@主机:端口/数据库名
```

#### Redis 连接失败

检查 Redis 是否运行：

```bash
# macOS
brew services list | grep redis

# Linux
systemctl status redis
```

检查连接字符串是否正确：

```env
REDIS_URL=redis://主机:端口/数据库编号
```

#### Docker 容器无法启动

```bash
# 查看日志
make docker-logs

# 重新构建
make docker-down
make docker-up
```

### 常见错误

#### Error: Cannot find module '@/...'

这是 TypeScript 路径别名问题。确保：

1. `tsconfig.json` 中有正确的路径配置
2. 使用开发模式 (`make dev-frontend`)

#### Error: EADDRINUSE

端口被占用。更改端口或杀死占用进程：

```bash
# 更改前端端口
PORT=3001 make dev-frontend

# 更改后端端口
cd backend
PORT=3002 npm run dev
```

## 📖 更多文档

- [项目计划](PROJECT_PLAN.md)
- [技术架构](TECHNICAL_ARCHITECTURE.md)
- [开发任务](DEVELOPMENT_TASKS.md)
- [环境配置](ENVIRONMENT_CONFIG.md)
- [部署指南](DEPLOYMENT_GUIDE.md)
- [项目状态](PROJECT_STATUS.md)

## 💡 开发提示

### 热重载

- 前端: 保存文件后自动刷新
- 后端: 使用 `tsx watch` 自动重启

### 调试

#### 前端调试

使用浏览器开发者工具：

1. 打开 Chrome DevTools (F12)
2. 在 Sources 标签页设置断点
3. 刷新页面触发断点

#### 后端调试

在 `src/server.ts` 中添加 `console.log` 或使用 VS Code 调试：

1. 在 `.vscode/launch.json` 中添加配置
2. 按 F5 启动调试
3. 设置断点

### 代码格式化

使用 ESLint 和 Prettier：

```bash
# 前端
cd frontend
npm run lint:fix

# 后端
cd backend
npm run lint:fix
```

### 提交代码

```bash
# 1. 检查代码
make lint

# 2. 运行测试
make test

# 3. 提交
git add .
git commit -m "feat: 添加新功能"
git push
```

## 🎉 开始开发

现在你已经准备好开始开发了！

1. 选择一个待实现的工具
2. 在 `frontend/src/lib/tools/` 创建工具类
3. 在 `backend/src/services/tools/` 实现业务逻辑
4. 添加路由和测试
5. 提交代码

祝你编码愉快！🚀
