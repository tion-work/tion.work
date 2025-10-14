# tion.work Backend

基于 Gin 框架的 Go 后端 API 服务，为 tion.work 生态系统提供后端支持。

## 🚀 特性

- **Gin 框架** - 高性能的 Go Web 框架
- **GORM** - 强大的 ORM 库，支持 PostgreSQL 和 SQLite
- **Redis** - 缓存和会话存储
- **结构化日志** - 使用 logrus 进行日志记录
- **中间件支持** - CORS、认证、限流等
- **Docker 支持** - 容器化部署
- **健康检查** - API 健康状态监控

## 📁 项目结构

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # 应用入口
├── internal/
│   ├── api/
│   │   └── routes.go        # 路由定义
│   ├── config/
│   │   └── config.go        # 配置管理
│   ├── database/
│   │   └── database.go      # 数据库连接
│   ├── middleware/
│   │   └── middleware.go    # 中间件
│   ├── models/
│   │   └── database.go      # 数据模型
│   ├── response/
│   │   └── response.go      # 响应格式
│   └── services/
│       ├── tool_service.go  # 工具服务
│       └── stats_service.go # 统计服务
├── pkg/
│   ├── logging/
│   │   └── logger.go        # 日志工具
│   └── utils/               # 工具函数
├── static/                  # 静态文件
├── templates/               # 模板文件
├── go.mod                   # Go 模块文件
├── go.sum                   # 依赖校验
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── Makefile                # 构建脚本
└── README.md               # 项目文档
```

## 🛠️ 安装和运行

### 前置要求

- Go 1.23+
- PostgreSQL 或 SQLite
- Redis (可选)

### 1. 克隆项目

```bash
git clone <repository-url>
cd tion-backend
```

### 2. 安装依赖

```bash
make deps
# 或者
go mod tidy
```

### 3. 配置环境变量

```bash
cp env.example .env
# 编辑 .env 文件，配置数据库和其他设置
```

### 4. 运行项目

```bash
# 开发模式
make dev

# 或者构建后运行
make build
make run
```

## 🐳 Docker 部署

### 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 单独构建 Docker 镜像

```bash
# 构建镜像
make docker-build

# 运行容器
make docker-run
```

## 📚 API 文档

### 基础端点

- `GET /health` - 健康检查
- `GET /api/health` - API 健康检查

### 工具管理

- `GET /api/tools` - 获取所有工具
- `GET /api/tools/:id` - 获取特定工具
- `POST /api/tools` - 创建工具
- `PUT /api/tools/:id` - 更新工具
- `DELETE /api/tools/:id` - 删除工具
- `POST /api/tools/:id/use` - 记录工具使用

### 统计信息

- `GET /api/stats/tools` - 工具统计
- `GET /api/stats/usage` - 使用统计
- `GET /api/stats/overview` - 概览统计

### 管理接口 (需要 API Key)

- `GET /api/admin/tools` - 管理工具
- `POST /api/admin/tools` - 创建工具
- `PUT /api/admin/tools/:id` - 更新工具
- `DELETE /api/admin/tools/:id` - 删除工具
- `GET /api/admin/stats` - 管理统计

## 🔧 配置

### 环境变量

| 变量名         | 描述             | 默认值                     |
| -------------- | ---------------- | -------------------------- |
| `PORT`         | 服务端口         | `8080`                     |
| `GIN_MODE`     | Gin 模式         | `debug`                    |
| `DATABASE_URL` | 数据库连接字符串 | -                          |
| `REDIS_URL`    | Redis 连接字符串 | `redis://localhost:6379/0` |
| `API_KEY`      | API 认证密钥     | -                          |
| `SERVICE_NAME` | 服务名称         | `Tion Backend API`         |
| `VERSION`      | 版本号           | `1.0.0`                    |

## 🧪 测试

```bash
# 运行所有测试
make test

# 运行特定包的测试
go test ./internal/services/

# 运行测试并显示覆盖率
go test -cover ./...
```

## 📝 开发

### 代码结构

- **cmd/** - 应用入口点
- **internal/** - 内部包，不对外暴露
- **pkg/** - 可重用的包
- **api/** - API 路由和处理器
- **services/** - 业务逻辑层
- **models/** - 数据模型
- **middleware/** - 中间件

### 添加新功能

1. 在 `internal/models/` 中定义数据模型
2. 在 `internal/services/` 中实现业务逻辑
3. 在 `internal/api/` 中添加路由和处理器
4. 更新 `internal/api/routes.go` 注册新路由

## 🚀 部署

### 生产环境部署

1. 设置环境变量
2. 构建应用：`make build`
3. 运行应用：`make run`

### 使用 Docker 部署

1. 构建镜像：`make docker-build`
2. 运行容器：`make docker-run`

## 📊 监控

- 健康检查：`GET /health`
- 日志：使用 logrus 结构化日志
- 指标：可集成 Prometheus 等监控系统

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License
