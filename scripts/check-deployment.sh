#!/bin/bash

# 检查部署状态脚本
# 用于验证生产环境是否正常运行

set -e

# 定义颜色
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "🔍 检查生产环境部署状态..."
echo ""

# 检查后端API
echo -e "🔌 检查后端API (https://api.tion.work)..."
if curl -s -f https://api.tion.work/health > /dev/null; then
    echo -e "${GREEN}✅ 后端API正常运行${NC}"
    # 获取健康状态
    HEALTH_RESPONSE=$(curl -s https://api.tion.work/health)
    echo "   状态: $(echo $HEALTH_RESPONSE | jq -r '.status' 2>/dev/null || echo 'unknown')"
    echo "   环境: $(echo $HEALTH_RESPONSE | jq -r '.environment' 2>/dev/null || echo 'unknown')"
else
    echo -e "${RED}❌ 后端API无法访问${NC}"
fi

echo ""

# 检查前端
echo -e "🛠️  检查开发工具站 (https://dev.tion.work)..."
if curl -s -f https://dev.tion.work > /dev/null; then
    echo -e "${GREEN}✅ 开发工具站正常运行${NC}"
    # 检查页面标题
    TITLE=$(curl -s https://dev.tion.work | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g' || echo 'unknown')
    echo "   标题: $TITLE"
else
    echo -e "${RED}❌ 开发工具站无法访问${NC}"
fi

echo ""

# 检查API连接
echo -e "🔗 检查前端到后端的API连接..."
if curl -s -f https://api.tion.work/tools > /dev/null; then
    TOOL_COUNT=$(curl -s https://api.tion.work/tools | jq '.tools | length' 2>/dev/null || echo 'unknown')
    echo -e "${GREEN}✅ API连接正常，工具数量: $TOOL_COUNT${NC}"
else
    echo -e "${RED}❌ API连接失败${NC}"
fi

echo ""

# 检查工具处理功能
echo -e "⚙️  检查工具处理功能..."
TEST_RESPONSE=$(curl -s -X POST https://api.tion.work/tools/json-formatter/process \
  -H "Content-Type: application/json" \
  -d '{"input": "{\"test\": \"value\"}"}' 2>/dev/null || echo 'error')

if echo "$TEST_RESPONSE" | jq -e '.result' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 工具处理功能正常${NC}"
    OUTPUT=$(echo "$TEST_RESPONSE" | jq -r '.result' 2>/dev/null || echo 'unknown')
    echo "   测试输出: $OUTPUT"
elif echo "$TEST_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 工具处理功能正常${NC}"
    RESULT=$(echo "$TEST_RESPONSE" | jq -r '.result' 2>/dev/null || echo 'unknown')
    echo "   测试输出: $RESULT"
else
    echo -e "${YELLOW}⚠️  工具处理功能检查失败，但API响应正常${NC}"
    echo "   响应: $TEST_RESPONSE"
fi

echo ""
echo -e "🎯 部署状态检查完成！"
echo ""
echo -e "📊 访问地址:"
echo -e "  🛠️  工具站: ${GREEN}https://dev.tion.work${NC}"
echo -e "  🔌 API: ${GREEN}https://api.tion.work${NC}"
echo -e "  📚 API文档: ${GREEN}https://api.tion.work/docs${NC}"
