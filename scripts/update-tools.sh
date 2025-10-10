#!/bin/bash

# 更新所有工具类，添加缺少的属性

TOOLS_DIR="frontends/dev/src/lib/tools"

# 为每个工具文件添加缺少的属性
for file in "$TOOLS_DIR"/*.ts; do
  if [[ -f "$file" && "$file" != *"base.ts" && "$file" != *"registry.ts" ]]; then
    echo "更新 $file"

    # 添加 color 属性（如果不存在）
    if ! grep -q "color = " "$file"; then
      sed -i '' '/icon = /a\
  color = "bg-blue-500";
' "$file"
    fi

    # 添加 inputLanguage 属性（如果不存在）
    if ! grep -q "inputLanguage" "$file"; then
      sed -i '' '/color = /a\
  inputLanguage = "json";
' "$file"
    fi

    # 添加 inputPlaceholder 属性（如果不存在）
    if ! grep -q "inputPlaceholder" "$file"; then
      sed -i '' '/inputLanguage = /a\
  inputPlaceholder = "请输入 JSON 数据...";
' "$file"
    fi

    # 添加 outputLanguage 属性（如果不存在）
    if ! grep -q "outputLanguage" "$file"; then
      sed -i '' '/inputPlaceholder = /a\
  outputLanguage = "json";
' "$file"
    fi

    # 添加 initialInput 属性（如果不存在）
    if ! grep -q "initialInput" "$file"; then
      sed -i '' '/outputLanguage = /a\
  initialInput = "";
' "$file"
    fi
  fi
done

echo "工具类更新完成！"
