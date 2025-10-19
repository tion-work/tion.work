#!/bin/bash
# 简化的组件创建脚本

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 获取参数
COMPONENT_NAME="$1"
PROJECT="$2"

if [[ -z "$COMPONENT_NAME" ]]; then
    echo "用法: $0 <组件名称> [项目名称]"
    echo "示例: $0 UserAvatar dev"
    exit 1
fi

# 设置默认项目
if [[ -z "$PROJECT" ]]; then
    PROJECT="shared"
fi

# 创建组件目录
if [[ "$PROJECT" == "shared" ]]; then
    COMPONENT_DIR="shared/components/$COMPONENT_NAME"
else
    COMPONENT_DIR="frontends/$PROJECT/src/components/$COMPONENT_NAME"
fi

log_info "创建组件: $COMPONENT_NAME"
log_info "目标项目: $PROJECT"
log_info "组件目录: $COMPONENT_DIR"

# 创建目录
mkdir -p "$COMPONENT_DIR"

# 生成组件文件
log_info "生成组件文件..."

# 主组件文件
cat > "$COMPONENT_DIR/$COMPONENT_NAME.tsx" << EOF
import React from 'react';

export interface ${COMPONENT_NAME}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${COMPONENT_NAME}: React.FC<${COMPONENT_NAME}Props> = ({
  className = '',
  children
}) => {
  return (
    <div className={\`${COMPONENT_NAME,,} \${className}\`}>
      {children}
    </div>
  );
};

export default ${COMPONENT_NAME};
EOF

# 测试文件
cat > "$COMPONENT_DIR/$COMPONENT_NAME.test.tsx" << EOF
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

describe('${COMPONENT_NAME}', () => {
  it('renders without crashing', () => {
    render(<${COMPONENT_NAME} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(<${COMPONENT_NAME}>Test content</${COMPONENT_NAME}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
EOF

# Storybook 文件
cat > "$COMPONENT_DIR/$COMPONENT_NAME.stories.tsx" << EOF
import type { Meta, StoryObj } from '@storybook/react';
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

const meta: Meta<typeof ${COMPONENT_NAME}> = {
  title: 'Components/${COMPONENT_NAME}',
  component: ${COMPONENT_NAME},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithChildren: Story = {
  args: {
    children: 'Test content',
  },
};
EOF

# 样式文件
cat > "$COMPONENT_DIR/$COMPONENT_NAME.module.css" << EOF
.${COMPONENT_NAME,,} {
  /* 组件样式 */
}
EOF

# 导出文件
cat > "$COMPONENT_DIR/index.ts" << EOF
export { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';
export type { ${COMPONENT_NAME}Props } from './${COMPONENT_NAME}';
EOF

# README 文件
cat > "$COMPONENT_DIR/README.md" << EOF
# ${COMPONENT_NAME}

一个 React 组件。

## 用法

\`\`\`tsx
import { ${COMPONENT_NAME} } from './${COMPONENT_NAME}';

<${COMPONENT_NAME}>
  Content here
</${COMPONENT_NAME}>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |
EOF

log_success "组件创建完成!"
echo ""
echo "📁 组件位置: $COMPONENT_DIR"
echo "📝 生成的文件:"
echo "  - $COMPONENT_NAME.tsx (主组件)"
echo "  - $COMPONENT_NAME.test.tsx (测试)"
echo "  - $COMPONENT_NAME.stories.tsx (Storybook)"
echo "  - $COMPONENT_NAME.module.css (样式)"
echo "  - index.ts (导出)"
echo "  - README.md (文档)"
