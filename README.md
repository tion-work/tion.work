# tion.work

一个现代化、高效的开发者工具集合平台，为开发者提供一站式解决方案。

## 🚀 快速开始

```bash
# 安装所有依赖
make install

# 启动所有前端 + 后端
make start

# 或者单独启动各个服务
make dev    # 开发工具站
make index  # 主站
make admin  # 管理后台
make docs   # 文档站点
make mobile # 移动端
make crypto # 加密货币导航站
make backend # 后端开发服务器
```

## 📋 可用命令

运行 `make help` 查看所有可用命令：

```bash
make help
```

### 开发命令

- `make install` - 安装所有依赖
- `make start` - 启动所有前端 + 后端
- `make index` - 仅启动主站 (端口 3001)
- `make dev` - 仅启动开发工具站 (端口 3002)
- `make admin` - 仅启动管理后台 (端口 3003)
- `make docs` - 仅启动文档站点 (端口 3004)
- `make mobile` - 仅启动移动端 (端口 3005)
- `make crypto` - 仅启动加密货币导航站 (端口 3006)
- `make backend` - 仅启动后端开发服务器 (端口 8080)
- `make docker` - 使用 Docker 启动后端
- `make stop` - 停止所有服务
- `make restart` - 重启开发环境 (停止 + 启动)

### 构建命令

- `make build` - 构建所有项目

### 测试和检查

- `make test` - 运行所有测试
- `make check` - 代码质量检查 (所有项目)
- `make lint` - 运行代码检查
- `make lint-fix` - 自动修复代码问题

### 清理命令

- `make clean` - 清理构建文件和依赖

### 生产部署命令

- `make deploy-api` - 部署后端 API 到 Railway
- `make deploy-dev` - 部署开发工具站到 Netlify
- `make deploy-crypto` - 部署加密货币导航站到 Netlify
- `make deploy-all` - 部署所有项目到生产环境
- `make check-deploy` - 检查生产环境部署状态

## 🌐 访问地址

- **主站**: http://localhost:3001
- **开发工具站**: http://localhost:3002
- **管理后台**: http://localhost:3003
- **文档站点**: http://localhost:3004
- **移动端**: http://localhost:3005
- **加密货币导航站**: http://localhost:3006
- **后端 API**: http://localhost:8080
- **API 健康检查**: http://localhost:8080/health

## 🛠️ 技术栈

### 前端

- Next.js 15.5.4
- React 19.1.0
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Monaco Editor (代码编辑器)

### 后端

- Go 1.23
- Gin 框架
- GORM (数据库 ORM)
- PostgreSQL / SQLite
- Redis
- Docker

## 📁 项目结构

```
tion.work/
├── frontends/             # 多前端应用
│   ├── index/            # 主站 (端口 3001)
│   ├── dev/              # 开发工具站 (端口 3002)
│   ├── admin/            # 管理后台 (端口 3003)
│   ├── docs/             # 文档站点 (端口 3004)
│   ├── mobile/           # 移动端 (端口 3005)
│   └── crypto-nav/       # 加密货币导航站 (端口 3006)
├── backend/              # Go 后端 API (端口 8080)
│   ├── cmd/              # 应用入口
│   ├── internal/         # 内部包
│   ├── pkg/              # 可重用包
│   ├── go.mod            # Go 模块
│   ├── Dockerfile        # Docker 配置
│   └── docker-compose.yml # Docker Compose
├── shared/               # 共享资源
├── docs/                 # 项目文档
├── scripts/              # 脚本文件
├── Makefile              # 项目管理脚本
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
   # 启动所有服务
   make start

   # 或者单独启动各个服务
   make dev    # 开发工具站
   make index  # 主站
   make admin  # 管理后台
   make docs   # 文档站点
   make mobile # 移动端
   make crypto # 加密货币导航站
   make backend # 后端开发服务器
   ```

4. **访问应用**
   - 主站: http://localhost:3001
   - 开发工具站: http://localhost:3002
   - 管理后台: http://localhost:3003
   - 文档站点: http://localhost:3004
   - 移动端: http://localhost:3005
   - 加密货币导航站: http://localhost:3006
   - 后端 API: http://localhost:8080

## 🐳 Docker 使用

项目支持 Docker 部署，后端服务可以通过 Docker 运行：

```bash
# 使用 Docker 启动后端
make docker

# 或者进入后端目录使用 Docker Compose
cd backend && docker-compose up -d
```

## 📝 环境变量

后端环境变量配置：

```bash
# 进入后端目录
cd backend

# 复制环境变量示例文件
cp env.example .env
```

主要配置项：

- `PORT` - 服务端口 (默认: 8080)
- `GIN_MODE` - Gin 模式 (debug/release)
- `DATABASE_URL` - 数据库连接字符串
- `REDIS_URL` - Redis 连接字符串
- `API_KEY` - API 认证密钥
- `SERVICE_NAME` - 服务名称
- `VERSION` - 版本号

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
