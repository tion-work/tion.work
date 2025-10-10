#!/bin/bash

# 修复所有工具类的 category 类型问题
cd frontends/dev/src/lib/tools

for file in *.ts; do
  if [ "$file" != "base.ts" ] && [ "$file" != "registry.ts" ] && [ "$file" != "index.ts" ]; then
    echo "修复文件: $file"
    
    # 添加 ToolCategory 导入
    if ! grep -q "import.*ToolCategory" "$file"; then
      sed -i '' '1a\
import { ToolCategory } from '\''../../types'\'';
' "$file"
    fi
    
    # 修复 category 属性类型
    sed -i '' 's/category = /category: ToolCategory = /g' "$file"
  fi
done

echo "修复完成！"
