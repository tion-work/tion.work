# tion.work

一个现代化、高效的开发者工具集合平台，为开发者提供一站式解决方案。

## 🚀 快速开始

```bash
# 安装所有依赖
make install

# 启动开发环境（推荐使用 Docker 后端）
make dev-docker

# 或者启动完整开发环境
make dev
```

## 📋 可用命令

运行 `make help` 查看所有可用命令：

```bash
make help
```

### 开发环境
- `make dev` - 启动开发环境 (前端 + 后端)
- `make dev-frontend` - 仅启动前端开发服务器
- `make dev-backend` - 仅启动后端开发服务器
- `make dev-docker` - 使用 Docker 启动后端

### 构建和部署
- `make build` - 构建所有项目
- `make build-frontend` - 构建前端
- `make build-backend` - 构建后端
- `make start` - 启动生产环境

### 测试和代码质量
- `make test` - 运行所有测试
- `make test-frontend` - 运行前端测试
- `make test-backend` - 运行后端测试
- `make lint` - 运行代码检查
- `make lint-fix` - 修复代码格式问题

### Docker 管理
- `make docker-up` - 启动 Docker 服务
- `make docker-down` - 停止 Docker 服务
- `make docker-logs` - 查看 Docker 日志

### 维护
- `make clean` - 清理构建文件和依赖
- `make install` - 安装所有依赖

## 🌐 访问地址

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001
- **API 文档**: http://localhost:3001/docs

## 🛠️ 技术栈

### 前端
- Next.js 15.5.4
- React 19.1.0
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Monaco Editor (代码编辑器)

### 后端
- Node.js 20
- Fastify
- TypeScript
- PostgreSQL
- Redis
- Docker

## 📁 项目结构

```
tion.work/
├── frontend/              # Next.js 前端应用
│   ├── src/              # 源代码
│   ├── package.json      # 前端依赖
│   └── ...
├── backend/               # Fastify 后端 API
│   ├── src/              # 源代码
│   ├── package.json      # 后端依赖
│   ├── docker-compose.yml # Docker 配置
│   └── ...
├── Makefile              # 项目管理脚本
├── env.example           # 环境变量示例
└── README.md             # 项目说明
```

## 🔧 开发指南

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd tion.work
   ```

2. **安装依赖**
   ```bash
   make install
   ```

3. **启动开发环境**
   ```bash
   # 使用 Docker 后端（推荐）
   make dev-docker
   
   # 或者本地开发
   make dev
   ```

4. **访问应用**
   - 前端: http://localhost:3000
   - 后端: http://localhost:3001
   - API 文档: http://localhost:3001/docs

## 🐳 Docker 使用

项目支持 Docker 部署，后端服务可以通过 Docker 运行：

```bash
# 启动 Docker 服务
make docker-up

# 查看日志
make docker-logs

# 停止服务
make docker-down
```

## 📝 环境变量

复制 `env.example` 文件并配置环境变量：

```bash
cp env.example .env
```

主要配置项：
- `DATABASE_URL` - PostgreSQL 数据库连接
- `REDIS_URL` - Redis 缓存连接
- `JWT_SECRET` - JWT 密钥
- `CORS_ORIGIN` - CORS 允许的源

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！