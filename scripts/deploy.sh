#!/bin/bash

# TiON.Work 部署脚本
# 支持多前端 + 单后端架构

set -e

echo "🚀 开始部署 TiON.Work..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必要的工具
check_requirements() {
    echo -e "${BLUE}📋 检查部署要求...${NC}"

    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi

    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi

    # 检查 Railway CLI
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI 未安装，请先安装: npm install -g @railway/cli${NC}"
    fi

    # 检查 Netlify CLI
    if ! command -v netlify &> /dev/null; then
        echo -e "${YELLOW}⚠️  Netlify CLI 未安装，请先安装: npm install -g netlify-cli${NC}"
    fi

    echo -e "${GREEN}✅ 要求检查完成${NC}"
}

# 构建所有项目
build_projects() {
    echo -e "${BLUE}🔨 构建所有项目...${NC}"

    # 构建后端
    echo -e "${YELLOW}构建后端...${NC}"
    cd backend
    npm ci
    npm run build
    cd ..

    # 构建前端项目
    for frontend in frontends/*; do
        if [ -d "$frontend" ] && [ -f "$frontend/package.json" ]; then
            echo -e "${YELLOW}构建 $frontend...${NC}"
            cd "$frontend"
            npm ci
            npm run build
            cd ../..
        fi
    done

    echo -e "${GREEN}✅ 所有项目构建完成${NC}"
}

# 部署后端到 Railway
deploy_backend() {
    echo -e "${BLUE}🚂 部署后端到 Railway...${NC}"

    if ! command -v railway &> /dev/null; then
        echo -e "${RED}❌ Railway CLI 未安装，跳过后端部署${NC}"
        return
    fi

    cd backend

    # 检查是否已登录
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}请先登录 Railway: railway login${NC}"
        return
    fi

    # 部署
    echo -e "${YELLOW}部署中...${NC}"
    railway up --detach

    echo -e "${GREEN}✅ 后端部署完成${NC}"
    echo -e "${BLUE}后端 URL: https://api.tion.work${NC}"

    cd ..
}

# 部署前端到 Netlify
deploy_frontend() {
    local frontend_name=$1
    local frontend_path="frontends/$frontend_name"

    echo -e "${BLUE}🌐 部署 $frontend_name 到 Netlify...${NC}"

    if ! command -v netlify &> /dev/null; then
        echo -e "${RED}❌ Netlify CLI 未安装，跳过前端部署${NC}"
        return
    fi

    cd "$frontend_path"

    # 检查是否已登录
    if ! netlify status &> /dev/null; then
        echo -e "${YELLOW}请先登录 Netlify: netlify login${NC}"
        return
    fi

    # 部署
    echo -e "${YELLOW}部署中...${NC}"
    netlify deploy --prod --dir=.next

    echo -e "${GREEN}✅ $frontend_name 部署完成${NC}"

    cd ../..
}

# 主函数
main() {
    case "${1:-all}" in
        "check")
            check_requirements
            ;;
        "build")
            build_projects
            ;;
        "backend")
            check_requirements
            build_projects
            deploy_backend
            ;;
        "frontend")
            if [ -z "$2" ]; then
                echo -e "${RED}❌ 请指定前端项目名称 (dev, admin, docs, index, mobile)${NC}"
                exit 1
            fi
            check_requirements
            build_projects
            deploy_frontend "$2"
            ;;
        "dev")
            check_requirements
            build_projects
            deploy_backend
            deploy_frontend "dev"
            ;;
        "all")
            check_requirements
            build_projects
            deploy_backend
            deploy_frontend "dev"
            deploy_frontend "admin"
            deploy_frontend "docs"
            deploy_frontend "index"
            deploy_frontend "mobile"
            ;;
        *)
            echo -e "${BLUE}TiON.Work 部署脚本${NC}"
            echo ""
            echo "用法: $0 [命令] [选项]"
            echo ""
            echo "命令:"
            echo "  check                   检查部署要求"
            echo "  build                   构建所有项目"
            echo "  backend                 部署后端到 Railway"
            echo "  frontend <name>         部署指定前端到 Netlify"
            echo "  dev                     部署开发环境 (后端 + dev前端)"
            echo "  all                     部署所有项目"
            echo ""
            echo "前端项目:"
            echo "  dev                     工具站 (dev.tion.work)"
            echo "  admin                   管理后台 (admin.dev.tion.work)"
            echo "  docs                    文档站点 (docs.dev.tion.work)"
            echo "  index                   主站 (tion.work)"
            echo "  mobile                  移动端 (m.dev.tion.work)"
            echo ""
            echo "示例:"
            echo "  $0 check                # 检查要求"
            echo "  $0 build                # 构建所有项目"
            echo "  $0 backend              # 部署后端"
            echo "  $0 frontend dev         # 部署工具站"
            echo "  $0 dev                  # 部署开发环境"
            echo "  $0 all                  # 部署所有项目"
            ;;
    esac
}

main "$@"
