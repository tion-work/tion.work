#!/bin/bash

# 批量修复所有工具文件的多语言支持

TOOLS_DIR="src/lib/tools"

# 获取所有工具文件
TOOL_FILES=$(find $TOOLS_DIR -name "*.ts" -not -name "base.ts" -not -name "registry.ts" -not -name "index.ts")

for file in $TOOL_FILES; do
  echo "处理文件: $file"

  # 检查是否已经有getLocalizedContent方法
  if grep -q "getLocalizedContent" "$file"; then
    echo "  ✅ 已有多语言支持"
    continue
  fi

  # 提取工具类名
  CLASS_NAME=$(grep -o "export class [A-Za-z]*Tool" "$file" | sed 's/export class //' | sed 's/Tool//')

  if [ -z "$CLASS_NAME" ]; then
    echo "  ⚠️  未找到工具类名"
    continue
  fi

  echo "  工具类: ${CLASS_NAME}Tool"

  # 提取基本信息
  ID=$(grep -o 'id = "[^"]*"' "$file" | sed 's/id = "//' | sed 's/"//')
  NAME=$(grep -o 'name = "[^"]*"' "$file" | sed 's/name = "//' | sed 's/"//')
  DESCRIPTION=$(grep -o 'description = "[^"]*"' "$file" | sed 's/description = "//' | sed 's/"//')

  echo "  ID: $ID"
  echo "  Name: $NAME"
  echo "  Description: $DESCRIPTION"

  # 创建多语言方法
  cat >> "$file" << EOF

  getLocalizedContent(language: 'zh' | 'en') {
    if (language === 'en') {
      return {
        name: "${NAME}",
        description: "${DESCRIPTION}",
        inputPlaceholder: "Please enter content...",
        options: [],
      };
    }

    return {
      name: "${NAME}",
      description: "${DESCRIPTION}",
      inputPlaceholder: "请输入内容...",
      options: [],
    };
  }
EOF

  echo "  ✅ 添加多语言支持完成"
done

echo "🎉 所有工具文件多语言支持更新完成！"
