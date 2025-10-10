#!/bin/bash

# 为所有工具文件添加getLocalizedContent方法

cd frontends/dev

# 获取所有工具文件
TOOL_FILES=$(find src/lib/tools -name "*.ts" -not -name "base.ts" -not -name "registry.ts" -not -name "index.ts" -not -name "json-formatter.ts" -not -name "base64-encoder.ts" -not -name "password-generator.ts" -not -name "timestamp-converter.ts" -not -name "qr-code-generator.ts" -not -name "color-picker.ts")

for file in $TOOL_FILES; do
  echo "处理文件: $file"

  # 检查是否已经有getLocalizedContent方法
  if grep -q "getLocalizedContent" "$file"; then
    echo "  ✅ 已有多语言支持"
    continue
  fi

  # 在options数组后添加getLocalizedContent方法
  sed -i '' '/];$/a\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }\
' "$file"

  echo "  ✅ 添加多语言支持完成"
done

echo "🎉 所有工具文件多语言支持更新完成！"
