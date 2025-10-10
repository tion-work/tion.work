#!/bin/bash

# 修复工具选项中的 key 为 name
echo "🔧 修复工具选项中的 key 为 name..."

# 遍历所有工具文件
for file in frontends/dev/src/lib/tools/*.ts; do
  if [[ "$file" != "frontends/dev/src/lib/tools/base.ts" && "$file" != "frontends/dev/src/lib/tools/index.ts" && "$file" != "frontends/dev/src/lib/tools/registry.ts" ]]; then
    echo "处理 $file"

    # 替换 key: 为 name:
    sed -i '' 's/key: /name: /g' "$file"
  fi
done

echo "✅ 修复完成！"
