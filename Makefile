# dev.tion.work Makefile
# 多前端 + 单后端架构

.PHONY: help install dev build start test lint clean docker-up docker-down docker-logs

# 默认目标
help:
	@echo "dev.tion.work - 多前端开发者工具集合平台"
	@echo ""
	@echo "可用命令:"
	@echo "  install     - 安装所有依赖"
	@echo "  start       - 启动开发环境 (主站 + 后端)"
	@echo "  start-all   - 启动所有前端 + 后端"
	@echo "  index       - 仅启动主站 (端口 3001)"
	@echo "  dev         - 仅启动开发工具站 (端口 3002)"
	@echo "  admin       - 仅启动管理后台 (端口 3003)"
	@echo "  docs        - 仅启动文档站点 (端口 3004)"
	@echo "  mobile      - 仅启动移动端 (端口 3005)"
	@echo "  backend     - 仅启动后端开发服务器"
	@echo "  docker      - 使用 Docker 启动后端"
	@echo "  stop        - 停止所有服务"
	@echo "  restart     - 重启开发环境 (停止 + 启动)"
	@echo "  build       - 构建所有项目"
	@echo "  test        - 运行所有测试"
	@echo "  lint        - 运行代码检查"
	@echo "  clean       - 清理构建文件和依赖"
	@echo ""

# 安装依赖
install:
	@echo "📦 安装主站依赖..."
	@cd frontends/index && npm install
	@echo "📦 安装开发工具站依赖..."
	@cd frontends/dev && npm install
	@echo "📦 安装管理后台依赖..."
	@cd frontends/admin && npm install
	@echo "📦 安装文档站点依赖..."
	@cd frontends/docs && npm install
	@echo "📦 安装移动端依赖..."
	@cd frontends/mobile && npm install
	@echo "📦 安装后端依赖..."
	@cd backend && npm install
	@echo "✅ 所有依赖安装完成"

# 开发环境
start:
	@echo "🚀 启动开发环境 (主站 + 后端)..."
	@echo "启动主站服务器..."
	@cd frontends/index && npm run dev &
	@echo "启动后端开发服务器 (Docker)..."
	@cd backend && docker compose up -d

start-all:
	@echo "🚀 启动所有服务..."
	@echo "启动主站服务器 (端口 3001)..."
	@cd frontends/index && npm run dev &
	@echo "启动开发工具站服务器 (端口 3002)..."
	@cd frontends/dev && npm run dev &
	@echo "启动管理后台开发服务器 (端口 3003)..."
	@cd frontends/admin && npm run dev &
	@echo "启动文档站点开发服务器 (端口 3004)..."
	@cd frontends/docs && npm run dev &
	@echo "启动移动端开发服务器 (端口 3005)..."
	@cd frontends/mobile && npm run dev &
	@echo "启动后端开发服务器 (Docker)..."
	@cd backend && docker compose up -d

# 单独启动各个前端
index:
	@echo "🚀 启动主站 (端口 3001)..."
	@cd frontends/index && npm run dev

dev:
	@echo "🚀 启动开发工具站 (端口 3002)..."
	@cd frontends/dev && npm run dev

admin:
	@echo "🚀 启动管理后台 (端口 3003)..."
	@cd frontends/admin && npm run dev

docs:
	@echo "🚀 启动文档站点 (端口 3004)..."
	@cd frontends/docs && npm run dev

mobile:
	@echo "🚀 启动移动端 (端口 3005)..."
	@cd frontends/mobile && npm run dev

backend:
	@echo "🚀 启动后端开发服务器..."
	@cd backend && npm run dev

# Docker 后端
docker:
	@echo "🐳 使用 Docker 启动后端..."
	@cd backend && docker compose up -d

stop:
	@echo "🛑 停止所有服务..."
	@echo "停止前端开发服务器..."
	@pkill -f "npm run dev" || true
	@echo "停止后端 Docker 服务..."
	@cd backend && docker compose down || true
	@echo "✅ 所有服务已停止"

restart:
	@echo "🔄 重启开发环境..."
	@echo "停止现有进程..."
	@pkill -f "npm run dev" || true
	@cd backend && docker compose down || true
	@echo "重新启动..."
	@$(MAKE) start

# 构建
build:
	@echo "🔨 构建所有项目..."
	@$(MAKE) build-index

build-index:
	@echo "🔨 构建主站..."
	@cd frontends/index && npm run build


# 测试
test:
	@echo "🧪 运行所有测试..."
	@cd frontends/index && npm test || true
	@cd frontends/dev && npm test || true
	@cd frontends/admin && npm test || true
	@cd frontends/docs && npm test || true
	@cd frontends/mobile && npm test || true
	@cd backend && npm test || true

# 代码检查
lint:
	@echo "🔍 运行代码检查..."
	@cd frontends/index && npm run lint || true
	@cd frontends/dev && npm run lint || true
	@cd frontends/admin && npm run lint || true
	@cd frontends/docs && npm run lint || true
	@cd frontends/mobile && npm run lint || true
	@cd backend && npm run lint || true

# 清理
clean:
	@echo "🧹 清理构建文件和依赖..."
	@cd frontends/index && rm -rf .next node_modules
	@cd frontends/dev && rm -rf .next node_modules
	@cd frontends/admin && rm -rf .next node_modules
	@cd frontends/docs && rm -rf .next node_modules
	@cd frontends/mobile && rm -rf .next node_modules
	@cd backend && rm -rf dist node_modules
	@docker stop tion-backend || true
	@docker rmi tion-backend || true
	@echo "✅ 清理完成"


# 部署脚本
deploy-index:
	@echo "🚀 部署主站到 Netlify..."
	@cd frontends/index && netlify deploy --prod

deploy-dev:
	@echo "🚀 部署开发工具站到 Netlify..."
	@cd frontends/dev && netlify deploy --prod

deploy-admin:
	@echo "🚀 部署管理后台到 Netlify..."
	@cd frontends/admin && netlify deploy --prod

deploy-docs:
	@echo "🚀 部署文档站点到 Netlify..."
	@cd frontends/docs && netlify deploy --prod

deploy-mobile:
	@echo "🚀 部署移动端到 Netlify..."
	@cd frontends/mobile && netlify deploy --prod

deploy-backend:
	@echo "🚀 部署后端到 Railway..."
	@cd backend && railway up

deploy-all:
	@echo "🚀 部署所有项目..."
	@$(MAKE) deploy-index
	@$(MAKE) deploy-dev
	@$(MAKE) deploy-admin
	@$(MAKE) deploy-docs
	@$(MAKE) deploy-mobile
	@$(MAKE) deploy-backend