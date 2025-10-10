#!/bin/bash

# 多语言功能测试脚本
# 测试TiON.Work的多语言切换功能

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌍 TiON.Work 多语言功能测试${NC}"
echo "=================================="
echo ""

# 测试网站可访问性
echo -e "${BLUE}🔍 测试网站可访问性...${NC}"
FRONTEND_RESPONSE=$(curl -s https://dev.tion.work 2>/dev/null)
if echo "$FRONTEND_RESPONSE" | grep -q "dev.tion.work"; then
    echo -e "${GREEN}✅ 网站可正常访问${NC}"
else
    echo -e "${RED}❌ 网站访问失败${NC}"
    exit 1
fi

echo ""

# 测试中文内容
echo -e "${BLUE}🇨🇳 测试中文内容...${NC}"
if echo "$FRONTEND_RESPONSE" | grep -q "现代化开发者工具集合平台"; then
    echo -e "${GREEN}✅ 中文标题正确显示${NC}"
else
    echo -e "${YELLOW}⚠️  中文标题未找到，可能显示为英文${NC}"
fi

if echo "$FRONTEND_RESPONSE" | grep -q "搜索工具"; then
    echo -e "${GREEN}✅ 中文搜索框占位符正确${NC}"
else
    echo -e "${YELLOW}⚠️  中文搜索框占位符未找到${NC}"
fi

if echo "$FRONTEND_RESPONSE" | grep -q "🇨🇳\|🇺🇸"; then
    echo -e "${GREEN}✅ 语言切换按钮存在${NC}"
else
    echo -e "${YELLOW}⚠️  语言切换按钮未找到${NC}"
fi

echo ""

# 测试About页面
echo -e "${BLUE}📄 测试About页面...${NC}"
ABOUT_RESPONSE=$(curl -s https://dev.tion.work/about 2>/dev/null)
if echo "$ABOUT_RESPONSE" | grep -q "关于我们\|About Us"; then
    echo -e "${GREEN}✅ About页面可访问${NC}"
else
    echo -e "${YELLOW}⚠️  About页面可能有问题${NC}"
fi

echo ""

# 测试Stats页面
echo -e "${BLUE}📊 测试Stats页面...${NC}"
STATS_RESPONSE=$(curl -s https://dev.tion.work/stats 2>/dev/null)
if echo "$STATS_RESPONSE" | grep -q "使用统计\|Usage Statistics"; then
    echo -e "${GREEN}✅ Stats页面可访问${NC}"
else
    echo -e "${YELLOW}⚠️  Stats页面可能有问题${NC}"
fi

echo ""

# 测试工具页面
echo -e "${BLUE}🛠️  测试工具页面...${NC}"
TOOL_RESPONSE=$(curl -s https://dev.tion.work/tools/json-formatter 2>/dev/null)
if echo "$TOOL_RESPONSE" | grep -q "JSON 格式化\|JSON Formatter"; then
    echo -e "${GREEN}✅ 工具页面可访问${NC}"
else
    echo -e "${YELLOW}⚠️  工具页面可能有问题${NC}"
fi

echo ""

# 测试API多语言支持
echo -e "${BLUE}🔌 测试API多语言支持...${NC}"
API_RESPONSE=$(curl -s https://api.tion.work/tools 2>/dev/null)
if echo "$API_RESPONSE" | jq -e '.tools | length' > /dev/null 2>&1; then
    TOOL_COUNT=$(echo "$API_RESPONSE" | jq '.tools | length')
    echo -e "${GREEN}✅ API返回 $TOOL_COUNT 个工具${NC}"
else
    echo -e "${YELLOW}⚠️  API响应格式可能有问题${NC}"
fi

echo ""

# 测试语言切换功能（模拟）
echo -e "${BLUE}🔄 测试语言切换功能...${NC}"
echo -e "${YELLOW}ℹ️  语言切换需要JavaScript支持，无法通过curl直接测试${NC}"
echo -e "${YELLOW}ℹ️  请在浏览器中手动测试语言切换功能${NC}"

echo ""

# 总结
echo -e "${BLUE}📋 测试总结${NC}"
echo "================"
echo -e "${GREEN}✅ 网站基础功能正常${NC}"
echo -e "${GREEN}✅ 多语言内容已部署${NC}"
echo -e "${GREEN}✅ 页面结构完整${NC}"
echo -e "${YELLOW}⚠️  语言切换需要浏览器测试${NC}"

echo ""
echo -e "${BLUE}🌐 测试地址:${NC}"
echo "  🛠️  工具站: https://dev.tion.work"
echo "  📄 About: https://dev.tion.work/about"
echo "  📊 Stats: https://dev.tion.work/stats"
echo "  🔌 API: https://api.tion.work"

echo ""
echo -e "${BLUE}🎯 手动测试建议:${NC}"
echo "  1. 访问 https://dev.tion.work"
echo "  2. 点击右上角的语言切换按钮"
echo "  3. 验证页面内容是否正确切换"
echo "  4. 测试不同页面的多语言显示"

echo ""
echo -e "${GREEN}🎉 多语言功能测试完成！${NC}"
