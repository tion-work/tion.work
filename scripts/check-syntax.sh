#!/bin/bash

# 语法检查脚本
# 用于检测常见的语法错误

set -e

echo "🔍 开始语法检查..."

# 检查未闭合的字符串
echo "检查未闭合的字符串..."
if grep -r "className.*[^\"']$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现未闭合的 className 字符串"
  exit 1
fi

if grep -r "text-.*[^\"']$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现未闭合的 text- 类字符串"
  exit 1
fi

if grep -r "bg-.*[^\"']$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现未闭合的 bg- 类字符串"
  exit 1
fi

if grep -r "border-.*[^\"']$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现未闭合的 border- 类字符串"
  exit 1
fi

# 检查未闭合的 JSX 标签
echo "检查未闭合的 JSX 标签..."
if grep -r "<[^>]*$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现未闭合的 JSX 标签"
  exit 1
fi

# 检查缺少分号
echo "检查缺少分号..."
if grep -r "const.*=.*{[^}]*$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现缺少分号的对象定义"
  exit 1
fi

# 检查缺少逗号
echo "检查缺少逗号..."
if grep -r "{[^}]*[^,}]$" frontends/ --include="*.tsx" --include="*.ts"; then
  echo "❌ 发现缺少逗号的对象定义"
  exit 1
fi

echo "✅ 语法检查通过！"
