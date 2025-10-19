#!/bin/bash
# AI 代码审查脚本 - 参考 Rulesync 项目的做法

echo "🔍 开始 AI 代码审查..."

# 检查参数
if [ $# -eq 0 ]; then
    echo "用法: $0 <文件路径或目录> [审查类型]"
    echo "审查类型: review(代码审查) | analyze(架构分析) | security(安全检查) | performance(性能分析)"
    exit 1
fi

TARGET="$1"
REVIEW_TYPE="${2:-review}"

# 检查目标是否存在
if [ ! -e "$TARGET" ]; then
    echo "❌ 错误: 目标文件或目录不存在: $TARGET"
    exit 1
fi

# 根据类型设置不同的提示词
case $REVIEW_TYPE in
    "review")
        PROMPT_PREFIX="请审查以下代码，从代码质量、安全性、最佳实践等角度进行分析："
        API_ENDPOINT="/api/review"
        ;;
    "analyze")
        PROMPT_PREFIX="请分析以下代码的架构设计、设计模式、依赖关系等："
        API_ENDPOINT="/api/analyze"
        ;;
    "security")
        PROMPT_PREFIX="请对以下代码进行安全性检查，重点关注安全漏洞和风险："
        API_ENDPOINT="/api/review"
        ;;
    "performance")
        PROMPT_PREFIX="请分析以下代码的性能问题并提供优化建议："
        API_ENDPOINT="/api/analyze"
        ;;
    *)
        echo "❌ 错误: 不支持的审查类型: $REVIEW_TYPE"
        echo "支持的类型: review, analyze, security, performance"
        exit 1
        ;;
esac

# 读取文件内容
if [ -f "$TARGET" ]; then
    echo "📄 审查文件: $TARGET"
    FILE_CONTENT=$(cat "$TARGET")
    FILE_EXTENSION="${TARGET##*.}"

    # 构建完整的审查消息
    FULL_MESSAGE="$PROMPT_PREFIX

\`\`\`$FILE_EXTENSION
$FILE_CONTENT
\`\`\`"
else
    echo "📁 审查目录: $TARGET"
    # 如果是目录，列出所有代码文件
    CODE_FILES=$(find "$TARGET" -type f \( -name "*.go" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.py" -o -name "*.java" -o -name "*.cpp" -o -name "*.c" \) | head -10)

    if [ -z "$CODE_FILES" ]; then
        echo "❌ 错误: 目录中没有找到代码文件"
        exit 1
    fi

    FULL_MESSAGE="$PROMPT_PREFIX

目录: $TARGET
文件列表: $(echo $CODE_FILES | tr '\n' ' ')

"

    # 添加每个文件的内容
    for file in $CODE_FILES; do
        echo "  📄 包含文件: $file"
        FILE_EXTENSION="${file##*.}"
        FILE_CONTENT=$(cat "$file")
        FULL_MESSAGE="$FULL_MESSAGE

文件: $file
\`\`\`$FILE_EXTENSION
$FILE_CONTENT
\`\`\`"
    done
fi

# 发送到 AI 审查服务
echo "🤖 发送到 AI 审查服务..."

# 创建临时 JSON 文件
TEMP_JSON=$(mktemp)
echo "{\"message\":\"$FULL_MESSAGE\"}" > "$TEMP_JSON"

# 发送请求并保存结果
OUTPUT_FILE="review_result_$(date +%Y%m%d_%H%M%S).md"
curl -N -H "Content-Type: application/json" \
     -d @"$TEMP_JSON" \
     "http://localhost:8080$API_ENDPOINT" \
     --output "$OUTPUT_FILE"

# 清理临时文件
rm "$TEMP_JSON"

if [ $? -eq 0 ]; then
    echo "✅ AI 代码审查完成！"
    echo "📋 审查结果已保存到: $OUTPUT_FILE"
else
    echo "❌ AI 代码审查失败"
    exit 1
fi
