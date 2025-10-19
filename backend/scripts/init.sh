#!/bin/bash
# 容器初始化脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 配置
REPO=${GITHUB_REPO:-"https://github.com/tion-work/tion.work.git"}
WORKDIR=${WORKSPACE:-"/workspace"}
FRONTENDS_DIR="$WORKDIR/frontends"

log_info "🚀 开始初始化 AI 开发助手容器..."

# 检查必需的环境变量
if [ -z "$CURSOR_API_KEY" ]; then
    log_error "CURSOR_API_KEY 环境变量未设置"
    exit 1
fi

log_info "📋 配置信息:"
log_info "  - 仓库地址: $REPO"
log_info "  - 工作目录: $WORKDIR"
log_info "  - 前端项目目录: $FRONTENDS_DIR"

# 创建工作目录
log_info "📁 创建工作目录..."
mkdir -p "$WORKDIR"
mkdir -p "$FRONTENDS_DIR"

# 克隆或更新仓库
if [ -d "$FRONTENDS_DIR/.git" ]; then
    log_info "🔄 更新现有仓库..."
    cd "$FRONTENDS_DIR"

    # 检查是否有未提交的更改
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log_warning "检测到未提交的更改，正在暂存..."
        git add .
        git commit -m "Auto-commit before pull" || true
    fi

    # 拉取最新代码
    git fetch origin
    git reset --hard origin/main
    log_success "仓库更新完成"
else
    log_info "📥 克隆仓库..."
    git clone "$REPO" "$FRONTENDS_DIR"
    log_success "仓库克隆完成"
fi

# 检查前端项目
log_info "🔍 检查前端项目..."
cd "$FRONTENDS_DIR"

# 列出所有前端项目
PROJECTS=$(find . -maxdepth 1 -type d -name "frontends" -exec find {} -maxdepth 1 -type d ! -name "frontends" \; 2>/dev/null | sed 's|^\./frontends/||' | grep -v '^$' | sort)

if [ -z "$PROJECTS" ]; then
    # 如果没有 frontends 子目录，检查当前目录下的项目
    PROJECTS=$(find . -maxdepth 1 -type d -name "frontends" -exec find {} -maxdepth 1 -type d ! -name "frontends" \; 2>/dev/null | sed 's|^\./frontends/||' | grep -v '^$' | sort)

    if [ -z "$PROJECTS" ]; then
        # 检查当前目录下的前端项目
        PROJECTS=$(find . -maxdepth 1 -type d -name "frontends" -exec find {} -maxdepth 1 -type d ! -name "frontends" \; 2>/dev/null | sed 's|^\./frontends/||' | grep -v '^$' | sort)
    fi
fi

if [ -z "$PROJECTS" ]; then
    log_warning "未找到前端项目，尝试查找 package.json 文件..."
    PROJECTS=$(find . -name "package.json" -not -path "*/node_modules/*" | xargs dirname | sed 's|^\./||' | sort)
fi

if [ -n "$PROJECTS" ]; then
    log_success "找到以下前端项目:"
    echo "$PROJECTS" | while read -r project; do
        if [ -n "$project" ]; then
            log_info "  - $project"
        fi
    done
else
    log_warning "未找到任何前端项目"
fi

# 安装依赖（如果存在 package.json）
log_info "📦 检查并安装依赖..."
for project in $PROJECTS; do
    if [ -f "$FRONTENDS_DIR/$project/package.json" ]; then
        log_info "安装项目 $project 的依赖..."
        cd "$FRONTENDS_DIR/$project"

        # 检查是否有 node_modules
        if [ ! -d "node_modules" ]; then
            log_info "运行 npm install..."
            npm install --legacy-peer-deps || log_warning "项目 $project 依赖安装失败"
        else
            log_info "项目 $project 依赖已存在，跳过安装"
        fi
    fi
done

# 检查 Cursor CLI
log_info "🔧 检查 Cursor CLI..."
if command -v cursor-agent >/dev/null 2>&1; then
    log_success "Cursor CLI 已安装"
    cursor-agent --version || log_warning "无法获取 Cursor CLI 版本"
else
    log_error "Cursor CLI 未安装"
    exit 1
fi

# 检查 Git 配置
log_info "🔧 检查 Git 配置..."
if [ -n "$GITHUB_TOKEN" ]; then
    git config --global credential.helper store
    echo "https://github.com:$GITHUB_TOKEN@github.com" > ~/.git-credentials
    log_success "Git 认证配置完成"
else
    log_warning "GITHUB_TOKEN 未设置，Git 操作可能受限"
fi

# 设置 Git 用户信息
git config --global user.name "AI Assistant" || true
git config --global user.email "ai@tion.work" || true

# 检查 Netlify CLI
if command -v netlify >/dev/null 2>&1; then
    log_success "Netlify CLI 已安装"
    if [ -n "$NETLIFY_AUTH_TOKEN" ]; then
        log_success "Netlify 认证令牌已配置"
    else
        log_warning "NETLIFY_AUTH_TOKEN 未设置，部署功能可能受限"
    fi
else
    log_warning "Netlify CLI 未安装，部署功能不可用"
fi

# 创建必要的目录
log_info "📁 创建必要的目录..."
mkdir -p "$WORKDIR/logs"
mkdir -p "$WORKDIR/temp"
mkdir -p "$WORKDIR/backups"

# 设置权限
chmod -R 755 "$WORKDIR"

# 显示系统信息
log_info "📊 系统信息:"
log_info "  - 工作目录: $WORKDIR"
log_info "  - 前端项目: $(echo "$PROJECTS" | wc -l) 个"
log_info "  - Node.js 版本: $(node --version 2>/dev/null || echo '未安装')"
log_info "  - npm 版本: $(npm --version 2>/dev/null || echo '未安装')"
log_info "  - Git 版本: $(git --version 2>/dev/null || echo '未安装')"

log_success "✅ 容器初始化完成！"
log_info "🌐 服务器将在端口 ${PORT:-8080} 启动"
log_info "📱 访问 http://localhost:${PORT:-8080} 开始使用"

# 启动服务器
log_info "🚀 启动 AI 开发助手服务器..."
cd /app
exec go run cmd/chat/main.go
