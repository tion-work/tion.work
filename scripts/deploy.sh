#!/bin/bash

# dev.tion.work 部署脚本
# 多前端 + 单后端架构

set -e

echo "🚀 开始部署 dev.tion.work..."

# 检查必要的工具
check_tools() {
    echo "🔍 检查部署工具..."
    
    if ! command -v netlify &> /dev/null; then
        echo "❌ Netlify CLI 未安装，请先安装: npm install -g netlify-cli"
        exit 1
    fi
    
    if ! command -v railway &> /dev/null; then
        echo "❌ Railway CLI 未安装，请先安装: npm install -g @railway/cli"
        exit 1
    fi
    
    echo "✅ 所有工具检查完成"
}

# 构建所有前端项目
build_frontends() {
    echo "🔨 构建所有前端项目..."
    
    echo "构建主站..."
    cd frontends/index
    npm run build
    cd ../..
    
    echo "构建开发工具站..."
    cd frontends/dev
    npm run build
    cd ../..
    
    echo "构建管理后台..."
    cd frontends/admin
    npm run build
    cd ../..
    
    echo "构建文档站点..."
    cd frontends/docs
    npm run build
    cd ../..
    
    echo "构建移动端..."
    cd frontends/mobile
    npm run build
    cd ../..
    
    echo "✅ 所有前端项目构建完成"
}

# 部署后端到 Railway
deploy_backend() {
    echo "🚀 部署后端到 Railway..."
    cd backend
    railway up
    cd ..
    echo "✅ 后端部署完成"
}

# 部署前端到 Netlify
deploy_frontends() {
    echo "🚀 部署前端到 Netlify..."
    
    echo "部署主站..."
    cd frontends/index
    netlify deploy --prod
    cd ../..
    
    echo "部署开发工具站..."
    cd frontends/dev
    netlify deploy --prod
    cd ../..
    
    echo "部署管理后台..."
    cd frontends/admin
    netlify deploy --prod
    cd ../..
    
    echo "部署文档站点..."
    cd frontends/docs
    netlify deploy --prod
    cd ../..
    
    echo "部署移动端..."
    cd frontends/mobile
    netlify deploy --prod
    cd ../..
    
    echo "✅ 所有前端部署完成"
}

# 主函数
main() {
    echo "🎯 开始部署流程..."
    
    # 检查工具
    check_tools
    
    # 构建前端
    build_frontends
    
    # 部署后端
    deploy_backend
    
    # 部署前端
    deploy_frontends
    
    echo "🎉 所有项目部署完成！"
    echo ""
    echo "🌐 访问地址:"
    echo "  主站: https://tion.work"
    echo "  开发工具站: https://dev.tion.work"
    echo "  管理后台: https://admin.dev.tion.work"
    echo "  文档站点: https://docs.dev.tion.work"
    echo "  移动端: https://m.dev.tion.work"
    echo "  API: https://api.tion.work"
}

# 运行主函数
main "$@"
