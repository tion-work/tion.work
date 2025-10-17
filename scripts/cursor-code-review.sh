#!/bin/bash
# simple-code-review.sh - 基础代码审查脚本

echo "开始代码审查..."

# 审查最近的更改
cursor-agent -p --force --output-format text \
  "审查最近的代码更改并提供以下方面的反馈：
  - 代码质量和可读性
  - 潜在的错误或问题
  - 安全考虑
  - 最佳实践合规性

  提供具体的改进建议并写入 review.txt"

if [ $? -eq 0 ]; then
  echo "✅ 代码审查成功完成"
else
  echo "❌ 代码审查失败"
  exit 1
fi