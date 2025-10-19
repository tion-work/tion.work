# 🤖 AI 开发助手容器系统架构

## 📋 项目概述

基于你提供的架构思路，我们成功构建了一个完整的 **AI 驱动的多前端项目自动开发平台**，通过 Gin + Cursor CLI + React + GitHub + Netlify 实现从需求到部署的全流程自动化。

## 🏗️ 系统架构

```
+--------------------------------------------------------------+
|                    AI 开发助手容器系统                        |
|                                                              |
|  +---------------------+       +---------------------------+ |
|  |  Gin Web Server     | <---> |   Cursor CLI (Agent)      | |
|  |  (REST + SSE + WS)  |       |   智能开发助手             | |
|  +---------------------+       +---------------------------+ |
|          ^    |
|          |    v
|  +-------------------+        +-----------------------------+ |
|  |  React 前端页面   | <----> |  Gin API / WebSocket 服务   | |
|  +-------------------+        +-----------------------------+ |
|                                                              |
|  本地开发目录结构：                                          |
|  /workspace/frontends/app1                                   |
|  /workspace/frontends/app2                                   |
|  /workspace/frontends/app3                                   |
|                                                              |
+--------------------------------------------------------------+
```

## 📁 项目结构

```
backend/
├── cmd/chat/main.go           # 主程序入口
├── handlers/                  # 请求处理器
│   ├── chat.go               # 聊天和 AI 交互
│   ├── project.go            # 项目管理
│   ├── git.go                # Git 操作
│   ├── deploy.go             # 部署管理
│   └── stream.go             # 流式输出
├── services/                  # 业务服务层
│   ├── cursor.go             # Cursor Agent 服务
│   ├── git.go                # Git 操作服务
│   ├── netlify.go            # Netlify 部署服务
│   └── config.go             # 配置管理
├── scripts/
│   └── init.sh               # 容器初始化脚本
├── templates/
│   └── chat-app.html         # 聊天界面
├── Dockerfile                # 容器化配置
└── go.mod                    # Go 模块依赖
```

## 🚀 核心功能

### 1. **AI 驱动的代码生成**

- 通过 Cursor CLI 执行 AI 任务
- 支持流式输出和实时反馈
- 支持多种任务类型：代码生成、审查、分析、安全、性能

### 2. **多项目管理**

- 自动发现和管理前端项目
- 项目状态监控和验证
- 依赖安装和构建管理

### 3. **Git 操作集成**

- 自动提交和推送
- 分支管理和切换
- 差异查看和状态监控

### 4. **一键部署**

- Netlify 自动部署
- 流式部署进度显示
- 部署状态监控

### 5. **实时流式输出**

- Server-Sent Events (SSE) 支持
- 实时日志和进度显示
- 多任务并发处理

## 🔧 API 接口

### 聊天和 AI 交互

```http
POST /api/chat              # 流式 AI 聊天
POST /api/chat/simple       # 简单 AI 聊天
POST /api/review            # 代码审查
POST /api/analyze           # 架构分析
```

### 项目管理

```http
GET  /api/projects                    # 获取项目列表
GET  /api/projects/:project           # 获取项目信息
GET  /api/projects/:project/status    # 获取项目状态
POST /api/projects/:project/install   # 安装依赖
POST /api/projects/:project/build     # 构建项目
POST /api/projects/:project/validate  # 验证项目
```

### Git 操作

```http
POST /api/git/commit              # 提交更改
POST /api/git/push                # 推送更改
POST /api/git/branch              # 创建分支
POST /api/git/switch              # 切换分支
GET  /api/git/:project/branches   # 获取分支列表
GET  /api/git/:project/diff       # 获取差异
POST /api/git/:project/reset      # 重置更改
```

### 部署管理

```http
POST /api/deploy                    # 部署项目
POST /api/deploy/stream             # 流式部署
GET  /api/deploy/:deployId/status   # 部署状态
GET  /api/deploy/site/info          # 站点信息
```

### 流式输出

```http
POST /api/stream/command            # 流式命令执行
GET  /api/stream/:project/logs      # 流式日志监控
```

## 🐳 容器化部署

### Dockerfile 特性

- 基于 Node.js 20 + Go 1.23
- 自动安装 Cursor CLI 和 Netlify CLI
- 支持多架构部署
- 自动初始化脚本

### 环境变量配置

```bash
# 服务器配置
PORT=8080
DEBUG=false
WORKSPACE=/workspace

# Cursor API 配置
CURSOR_API_KEY=your_cursor_api_key_here

# GitHub 配置
GITHUB_REPO=https://github.com/tion-work/tion.work.git
GITHUB_TOKEN=your_github_token_here

# Netlify 配置
NETLIFY_AUTH_TOKEN=your_netlify_auth_token_here
NETLIFY_SITE_ID=your_netlify_site_id_here
```

## 🔄 工作流程

### 1. 容器启动流程

```bash
1. 执行 init.sh 初始化脚本
2. 克隆或更新 GitHub 仓库
3. 检查前端项目
4. 安装依赖（如需要）
5. 启动 Gin 服务器
```

### 2. AI 开发流程

```bash
1. 用户通过聊天界面输入需求
2. 选择目标项目
3. 后端调用 Cursor CLI 执行任务
4. 流式返回执行结果
5. 用户确认后提交到 Git
6. 一键部署到 Netlify
```

### 3. 实时监控流程

```bash
1. 前端建立 SSE 连接
2. 后端流式推送执行日志
3. 实时显示进度和状态
4. 支持多任务并发处理
```

## 📊 技术栈

### 后端技术

- **Go 1.23** - 主要编程语言
- **Gin** - Web 框架
- **Server-Sent Events** - 实时通信
- **CORS** - 跨域支持

### 前端技术

- **React** - 用户界面
- **Tailwind CSS** - 样式设计
- **Monaco Editor** - 代码编辑
- **SSE Client** - 实时通信

### 外部服务

- **Cursor CLI** - AI 代码生成
- **GitHub** - 版本控制
- **Netlify** - 自动部署
- **Docker** - 容器化

## 🎯 核心优势

### 1. **完全自动化**

- 从需求到部署的全流程自动化
- 无需手动干预的智能开发

### 2. **实时反馈**

- 流式输出和进度显示
- 多任务并发处理

### 3. **多项目支持**

- 统一管理多个前端项目
- 项目间快速切换

### 4. **版本控制集成**

- 自动 Git 操作
- 分支管理和冲突解决

### 5. **一键部署**

- Netlify 自动部署
- 部署状态监控

## 🚀 使用方式

### 1. 启动容器

```bash
# 构建镜像
docker build -t ai-dev-assistant .

# 运行容器
docker run -p 8080:8080 \
  -e CURSOR_API_KEY=your_key \
  -e GITHUB_TOKEN=your_token \
  -e NETLIFY_AUTH_TOKEN=your_token \
  -e NETLIFY_SITE_ID=your_site_id \
  ai-dev-assistant
```

### 2. 访问界面

```bash
# 打开浏览器访问
http://localhost:8080
```

### 3. 开始开发

```bash
1. 选择目标项目
2. 输入开发需求
3. 观看 AI 实时生成代码
4. 确认后自动提交和部署
```

## 📈 性能特性

### 1. **高并发支持**

- 支持多用户同时使用
- 异步任务处理

### 2. **实时响应**

- SSE 流式输出
- 低延迟通信

### 3. **资源优化**

- 容器化部署
- 按需资源分配

### 4. **错误处理**

- 完善的错误处理机制
- 自动重试和恢复

## 🔮 未来扩展

### 1. **多 AI 模型支持**

- 支持不同的 AI 模型
- 模型切换和比较

### 2. **团队协作**

- 多用户权限管理
- 协作开发支持

### 3. **更多部署平台**

- Vercel 部署支持
- AWS 部署支持

### 4. **监控和分析**

- 使用统计和分析
- 性能监控面板

## ✅ 总结

这个 AI 开发助手容器系统成功实现了：

1. **完整的开发流程自动化** - 从需求到部署
2. **实时交互体验** - 流式输出和进度显示
3. **多项目管理** - 统一管理多个前端项目
4. **版本控制集成** - 自动 Git 操作
5. **一键部署** - Netlify 自动部署
6. **容器化部署** - 易于部署和扩展

通过这个系统，开发者只需要通过聊天界面描述需求，就能实现从代码生成到自动部署的完整流程，大大提高了开发效率和用户体验。

---

**🎉 项目已完成！现在你可以通过聊天界面与 AI 协作开发多个前端项目了！**
