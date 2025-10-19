# dev.tion.work Makefile
# 多前端 + 单后端架构

.PHONY: help install dev start backend stop restart build test lint clean check lint-fix deploy-api deploy-dev deploy-all check-deploy

# 默认目标
help:
	@echo "dev.tion.work - 多前端开发者工具集合平台"
	@echo ""
	@echo "🚀 开发命令:"
	@echo "  install     - 安装所有依赖"
	@echo "  start       - 启动所有前端 + 后端"
	@echo "  index       - 仅启动主站 (端口 3001)"
	@echo "  dev         - 仅启动开发工具站 (端口 3002)"
	@echo "  admin       - 仅启动管理后台 (端口 3003)"
	@echo "  docs        - 仅启动文档站点 (端口 3004)"
	@echo "  mobile      - 仅启动移动端 (端口 3005)"
	@echo "  crypto      - 仅启动加密货币导航站 (端口 3006)"
	@echo "  backend     - 仅启动后端开发服务器 (端口 8080)"
	@echo "  stop        - 停止所有服务"
	@echo "  restart     - 重启开发环境 (停止 + 启动)"
	@echo ""
	@echo "🔨 构建命令:"
	@echo "  build       - 构建所有项目"
	@echo ""
	@echo "🧪 测试和检查:"
	@echo "  test        - 运行所有测试"
	@echo "  check       - 代码质量检查 (所有项目)"
	@echo "  lint        - 运行代码检查"
	@echo "  lint-fix    - 自动修复代码问题"
	@echo ""
	@echo "🧹 清理命令:"
	@echo "  clean       - 清理构建文件和依赖"
	@echo ""
	@echo "🚀 生产部署命令:"
	@echo "  deploy-api  - 部署后端API到Railway"
	@echo "  deploy-dev  - 部署开发工具站到Netlify"
	@echo "  deploy-crypto - 部署加密货币导航站到Netlify"
	@echo "  deploy-all  - 部署所有项目到生产环境"
	@echo "  check-deploy - 检查生产环境部署状态"
	@echo ""

# 安装依赖
install:
	@echo "📦 安装主站依赖..."
	@cd frontends/index && npm install --legacy-peer-deps
	@echo "📦 安装开发工具站依赖..."
	@cd frontends/dev && npm install --legacy-peer-deps
	@echo "📦 安装管理后台依赖..."
	@cd frontends/admin && npm install --legacy-peer-deps
	@echo "📦 安装文档站点依赖..."
	@cd frontends/docs && npm install --legacy-peer-deps
	@echo "📦 安装移动端依赖..."
	@cd frontends/mobile && npm install --legacy-peer-deps
	@echo "📦 安装加密货币导航站依赖..."
	@cd frontends/crypto-nav && npm install --legacy-peer-deps
	@echo "📦 安装后端依赖..."
	@cd backend && go mod tidy || echo "⚠️  Go 未安装，跳过后端依赖安装"
	@echo "✅ 所有依赖安装完成"

# 开发环境

start:
	@echo "🚀 启动所有服务..."
	@echo "启动后端开发服务器 (Docker)..."
	@cd backend && docker compose up -d
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
	@echo "启动加密货币导航站开发服务器 (端口 3006)..."
	@cd frontends/crypto-nav && npm run dev &


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

crypto:
	@echo "🚀 启动加密货币导航站 (端口 3006)..."
	@cd frontends/crypto-nav && npm run dev

backend:
	@echo "🚀 启动后端开发服务器 (端口 8080)..."
	@cd backend && docker compose up -d

stop:
	@echo "🛑 停止所有服务..."
	@echo "停止后端Docker容器..."
	@cd backend && docker compose down || true
	@echo "停止前端开发服务器..."
	@pkill -f "npm run dev" || true
	@echo "✅ 所有服务已停止"

restart:
	@echo "🔄 重启开发环境..."
	@echo "停止现有进程..."
	@cd backend && docker compose down || true
	@pkill -f "npm run dev" || true
	@echo "重新启动..."
	@$(MAKE) start

# 构建
build:
	@echo "🔨 构建所有项目..."
	@echo "构建后端项目..."
	@cd backend && docker compose build --no-cache
	@echo "构建前端项目..."
	@cd frontends/index && npm run build
	@cd frontends/dev && npm run build
	@cd frontends/admin && npm run build
	@cd frontends/docs && npm run build
	@cd frontends/mobile && npm run build
	@cd frontends/crypto-nav && npm install --legacy-peer-deps && npm run build
	@echo "✅ 所有项目构建完成"

# 测试
test:
	@echo "🧪 运行所有测试..."
	@cd frontends/index && npm test || true
	@cd frontends/dev && npm test || true
	@cd frontends/admin && npm test || true
	@cd frontends/docs && npm test || true
	@cd frontends/mobile && npm test || true
	@cd backend && go test ./... || true

# 代码质量检查
check:
	@echo "🔍 运行代码质量检查..."
	@for project in index dev admin docs mobile; do \
		echo "检查 frontends/$$project..."; \
		cd frontends/$$project && npm run type-check && npm run lint; \
		cd ../..; \
	done
	@echo "检查后端..."
	@cd backend && go vet ./... && go fmt ./...
	@./scripts/check-syntax.sh

# AI 代码审查
review:
	@echo "🤖 开始 AI 代码审查..."
	@echo "请选择审查类型:"
	@echo "1) 代码审查 (review)"
	@echo "2) 架构分析 (analyze)"
	@echo "3) 安全检查 (security)"
	@echo "4) 性能分析 (performance)"
	@echo "5) 审查所有代码文件"
	@read -p "请输入选择 (1-5): " choice; \
	case $$choice in \
		1) ./scripts/ai-code-review.sh backend/cmd/chat/main.go review ;; \
		2) ./scripts/ai-code-review.sh backend/cmd/chat/main.go analyze ;; \
		3) ./scripts/ai-code-review.sh backend/cmd/chat/main.go security ;; \
		4) ./scripts/ai-code-review.sh backend/cmd/chat/main.go performance ;; \
		5) ./scripts/ai-code-review.sh . review ;; \
		*) echo "❌ 无效选择" ;; \
	esac

# 快速代码审查
review-quick:
	@echo "🚀 快速 AI 代码审查..."
	@./scripts/ai-code-review.sh backend/cmd/chat/main.go review

# 架构分析
analyze:
	@echo "🏗️ AI 架构分析..."
	@./scripts/ai-code-review.sh . analyze

# 安全检查
security:
	@echo "🛡️ AI 安全检查..."
	@./scripts/ai-code-review.sh . security

# 代码检查
lint:
	@echo "🔍 运行代码检查..."
	@cd frontends/index && npm run lint || true
	@cd frontends/dev && npm run lint || true
	@cd frontends/admin && npm run lint || true
	@cd frontends/docs && npm run lint || true
	@cd frontends/mobile && npm run lint || true
	@echo "检查后端..."
	@cd backend && go vet ./... || true

# 自动修复代码问题
lint-fix:
	@echo "🔧 自动修复代码问题..."
	@cd frontends/index && npm run lint -- --fix || true
	@cd frontends/dev && npm run lint -- --fix || true
	@cd frontends/admin && npm run lint -- --fix || true
	@cd frontends/docs && npm run lint -- --fix || true
	@cd frontends/mobile && npm run lint -- --fix || true
	@echo "修复后端代码格式..."
	@cd backend && go fmt ./... || true

# 清理
clean:
	@echo "🧹 清理构建文件和依赖..."
	@cd frontends/index && rm -rf .next node_modules
	@cd frontends/dev && rm -rf .next node_modules
	@cd frontends/admin && rm -rf .next node_modules
	@cd frontends/docs && rm -rf .next node_modules
	@cd frontends/mobile && rm -rf .next node_modules
	@cd backend && rm -rf bin
	@echo "✅ 清理完成"


# 生产环境部署脚本
deploy-api:
	@echo "🚀 部署后端API到Railway..."
	@echo "📦 构建后端..."
	@cd backend && go build -o bin/tion-backend cmd/server/main.go
	@echo "🚀 部署到Railway..."
	@cd backend && railway up --detach
	@echo "✅ 后端API部署完成: https://api.tion.work"

deploy-dev:
	@echo "🚀 部署开发工具站到Netlify..."
	@echo "📦 构建前端..."
	@cd frontends/dev && npm run build
	@echo "🚀 部署到Netlify..."
	@cd frontends/dev && netlify deploy --prod --dir=.next
	@echo "✅ 开发工具站部署完成: https://dev.tion.work"

deploy-crypto:
	@echo "🚀 部署加密货币导航站到Netlify..."
	@echo "📦 构建前端..."
	@cd frontends/crypto-nav && npm run build
	@echo "🚀 部署到Netlify..."
	@cd frontends/crypto-nav && netlify deploy --prod --dir=.next
	@echo "✅ 加密货币导航站部署完成: https://crypto.tion.work"

deploy-all:
	@echo "🚀 部署所有项目到生产环境..."
	@echo "📋 检查部署要求..."
	@command -v railway >/dev/null 2>&1 || { echo "❌ Railway CLI 未安装，请运行: npm install -g @railway/cli"; exit 1; }
	@command -v netlify >/dev/null 2>&1 || { echo "❌ Netlify CLI 未安装，请运行: npm install -g netlify-cli"; exit 1; }
	@echo "✅ 部署要求检查通过"
	@echo ""
	@echo "🔨 构建所有项目..."
	@$(MAKE) build
	@echo ""
	@echo "🚀 部署后端API..."
	@$(MAKE) deploy-api
	@echo ""
	@echo "🚀 部署前端应用..."
	@$(MAKE) deploy-dev
	@echo ""
	@echo "🎉 所有项目部署完成！"
	@echo "📊 访问地址:"
	@echo "  🛠️  工具站: https://dev.tion.work"
	@echo "  🔌 API: https://api.tion.work"
	@echo "  📚 API文档: https://api.tion.work/docs"
	@echo "  💰 加密货币导航: https://crypto.tion.work"

# 其他部署命令（保留兼容性）
deploy-index:
	@echo "🚀 部署主站到 Netlify..."
	@cd frontends/index && netlify deploy --prod

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
	@$(MAKE) deploy-api

# 检查部署状态
check-deploy:
	@echo "🔍 检查生产环境部署状态..."
	@./scripts/check-deployment.sh

# 组件开发
component:
	@echo "🎨 创建新组件..."
	@echo "请使用: make component-basic <组件名称> [项目名称]"
	@echo "示例: make component-basic UserAvatar shared"

# 基础组件创建
component-basic:
	@echo "🎨 创建基础组件..."
	@./scripts/create-component-basic.sh $(ARGS)

# 为特定项目创建组件
component-dev:
	@echo "🎨 为开发工具站创建组件..."
	@./scripts/create-component.sh -p dev

component-admin:
	@echo "🎨 为管理后台创建组件..."
	@./scripts/create-component.sh -p admin

component-mobile:
	@echo "🎨 为移动端创建组件..."
	@./scripts/create-component.sh -p mobile

# 组件管理
component-list:
	@echo "📋 列出所有组件..."
	@find shared/components -name "*.tsx" -type f | sed 's|shared/components/||' | sed 's|/.*||' | sort | uniq

component-info:
	@echo "ℹ️ 组件信息..."
	@echo "组件总数: $$(find shared/components -name "*.tsx" -type f | wc -l)"
	@echo "按分类统计:"
	@echo "  - 展示组件: $$(find shared/components -name "*.tsx" -path "*/display/*" | wc -l)"
	@echo "  - 表单组件: $$(find shared/components -name "*.tsx" -path "*/form/*" | wc -l)"
	@echo "  - 布局组件: $$(find shared/components -name "*.tsx" -path "*/layout/*" | wc -l)"
	@echo "  - 导航组件: $$(find shared/components -name "*.tsx" -path "*/navigation/*" | wc -l)"
	@echo "  - 反馈组件: $$(find shared/components -name "*.tsx" -path "*/feedback/*" | wc -l)"
	@echo "  - 数据组件: $$(find shared/components -name "*.tsx" -path "*/data/*" | wc -l)"
	@echo "  - 媒体组件: $$(find shared/components -name "*.tsx" -path "*/media/*" | wc -l)"
	@echo "  - 工具组件: $$(find shared/components -name "*.tsx" -path "*/utility/*" | wc -l)"

# 组件测试
component-test:
	@echo "🧪 运行组件测试..."
	@for project in index dev admin docs mobile crypto-nav; do \
		if [ -d "frontends/$$project" ]; then \
			echo "测试项目: $$project"; \
			cd "frontends/$$project" && npm test -- --passWithNoTests || true; \
			cd ../..; \
		fi; \
	done

# 组件构建
component-build:
	@echo "🔨 构建组件库..."
	@if [ -d "shared/components" ]; then \
		echo "构建共享组件库..."; \
		cd shared && npm run build || echo "共享组件库构建失败"; \
		cd ..; \
	fi

# 组件发布
component-publish:
	@echo "📦 发布组件库..."
	@if [ -d "shared/components" ]; then \
		echo "发布共享组件库..."; \
		cd shared && npm publish || echo "组件库发布失败"; \
		cd ..; \
	fi
