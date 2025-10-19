#!/bin/bash
# 组件创建脚本 - 通过聊天界面创建 React 组件

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 配置
PROJECT_ROOT="$(pwd)"
CHAT_API_URL="http://localhost:8080"
COMPONENTS_DIR="shared/components"

# 帮助信息
show_help() {
    echo "组件创建脚本 - AI 驱动的 React 组件生成"
    echo ""
    echo "用法: $0 [选项] <需求描述>"
    echo ""
    echo "选项:"
    echo "  -h, --help              显示帮助信息"
    echo "  -p, --project <项目>     指定目标项目 (index/dev/admin/docs/mobile/crypto-nav)"
    echo "  -c, --category <分类>    指定组件分类 (display/form/layout/navigation/feedback/data/media/utility)"
    echo "  -i, --interactive       交互模式"
    echo "  -v, --verbose           详细输出"
    echo ""
    echo "示例:"
    echo "  $0 \"创建一个用户头像组件\""
    echo "  $0 -p dev \"创建一个数据表格组件\""
    echo "  $0 -c form \"创建一个登录表单组件\""
    echo "  $0 -i"
}

# 解析命令行参数
TARGET_PROJECT=""
COMPONENT_CATEGORY=""
INTERACTIVE_MODE=false
VERBOSE=false
REQUIREMENT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--project)
            TARGET_PROJECT="$2"
            shift 2
            ;;
        -c|--category)
            COMPONENT_CATEGORY="$2"
            shift 2
            ;;
        -i|--interactive)
            INTERACTIVE_MODE=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
        *)
            REQUIREMENT="$1"
            shift
            ;;
    esac
done

# 交互模式
if [[ "$INTERACTIVE_MODE" == "true" ]]; then
    echo -e "${CYAN}🎨 组件创建向导${NC}"
    echo ""

    # 获取需求描述
    read -p "请描述要创建的组件: " REQUIREMENT

    # 选择目标项目
    echo ""
    echo "请选择目标项目:"
    echo "1) index (主站)"
    echo "2) dev (开发工具站)"
    echo "3) admin (管理后台)"
    echo "4) docs (文档站点)"
    echo "5) mobile (移动端)"
    echo "6) crypto-nav (加密货币导航站)"
    echo "7) shared (共享组件库)"

    read -p "请输入选择 (1-7): " project_choice
    case $project_choice in
        1) TARGET_PROJECT="index" ;;
        2) TARGET_PROJECT="dev" ;;
        3) TARGET_PROJECT="admin" ;;
        4) TARGET_PROJECT="docs" ;;
        5) TARGET_PROJECT="mobile" ;;
        6) TARGET_PROJECT="crypto-nav" ;;
        7) TARGET_PROJECT="shared" ;;
        *) TARGET_PROJECT="shared" ;;
    esac

    # 选择组件分类
    echo ""
    echo "请选择组件分类:"
    echo "1) display (展示组件)"
    echo "2) form (表单组件)"
    echo "3) layout (布局组件)"
    echo "4) navigation (导航组件)"
    echo "5) feedback (反馈组件)"
    echo "6) data (数据组件)"
    echo "7) media (媒体组件)"
    echo "8) utility (工具组件)"

    read -p "请输入选择 (1-8): " category_choice
    case $category_choice in
        1) COMPONENT_CATEGORY="display" ;;
        2) COMPONENT_CATEGORY="form" ;;
        3) COMPONENT_CATEGORY="layout" ;;
        4) COMPONENT_CATEGORY="navigation" ;;
        5) COMPONENT_CATEGORY="feedback" ;;
        6) COMPONENT_CATEGORY="data" ;;
        7) COMPONENT_CATEGORY="media" ;;
        8) COMPONENT_CATEGORY="utility" ;;
        *) COMPONENT_CATEGORY="utility" ;;
    esac
fi

# 检查必需参数
if [[ -z "$REQUIREMENT" ]]; then
    log_error "请提供组件需求描述"
    show_help
    exit 1
fi

# 设置默认值
if [[ -z "$TARGET_PROJECT" ]]; then
    TARGET_PROJECT="shared"
fi

if [[ -z "$COMPONENT_CATEGORY" ]]; then
    COMPONENT_CATEGORY="utility"
fi

# 主函数
main() {
    log_info "开始创建组件..."
    log_info "需求: $REQUIREMENT"
    log_info "目标项目: $TARGET_PROJECT"
    log_info "组件分类: $COMPONENT_CATEGORY"

    # 切换到项目目录
    cd "$PROJECT_ROOT"

    # 检查后端服务是否运行
    log_step "检查后端服务..."
    if ! curl -s "$CHAT_API_URL/health" >/dev/null 2>&1; then
        log_warning "后端服务未运行，尝试启动..."
        cd backend
        docker compose up -d
        sleep 10

        if ! curl -s "$CHAT_API_URL/health" >/dev/null 2>&1; then
            log_error "无法启动后端服务，请手动启动后重试"
            exit 1
        fi
    fi
    log_success "后端服务运行正常"

    # 创建组件
    log_step "创建组件..."

    # 构建请求数据
    local request_data="{
        \"message\": \"请创建一个 React 组件：$REQUIREMENT\",
        \"type\": \"review\",
        \"project\": \"$TARGET_PROJECT\",
        \"category\": \"$COMPONENT_CATEGORY\"
    }"

    # 发送请求到 AI 服务
    log_info "发送请求到 AI 服务..."
    local response=$(curl -s -X POST "$CHAT_API_URL/api/chat" \
        -H "Content-Type: application/json" \
        -d "$request_data")

    if [[ $? -ne 0 ]]; then
        log_error "请求失败"
        exit 1
    fi

    # 解析响应
    log_info "解析 AI 响应..."
    local component_name=$(echo "$response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    local component_code=$(echo "$response" | grep -o '"code":"[^"]*"' | cut -d'"' -f4)

    if [[ -z "$component_name" ]]; then
        log_warning "无法从响应中提取组件名称，使用默认名称"
        component_name="GeneratedComponent"
    fi

    # 创建组件目录
    local component_dir
    if [[ "$TARGET_PROJECT" == "shared" ]]; then
        component_dir="$COMPONENTS_DIR/$component_name"
    else
        component_dir="frontends/$TARGET_PROJECT/src/components/$component_name"
    fi

    log_info "创建组件目录: $component_dir"
    mkdir -p "$component_dir"

    # 生成组件文件
    log_step "生成组件文件..."

    # 生成主组件文件
    local component_file="$component_dir/$component_name.tsx"
    if [[ -n "$component_code" ]]; then
        echo "$component_code" > "$component_file"
    else
        # 生成默认组件
        cat > "$component_file" << EOF
import React from 'react';

export interface ${component_name}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${component_name}: React.FC<${component_name}Props> = ({
  className = '',
  children
}) => {
  return (
    <div className={\`${component_name,,} \${className}\`}>
      {children}
    </div>
  );
};

export default ${component_name};
EOF
    fi

    # 生成测试文件
    local test_file="$component_dir/$component_name.test.tsx"
    cat > "$test_file" << EOF
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${component_name} } from './${component_name}';

describe('${component_name}', () => {
  it('renders without crashing', () => {
    render(<${component_name} />);
    expect(screen.getByRole('generic')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(<${component_name}>Test content</${component_name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
EOF

    # 生成 Storybook 文件
    local story_file="$component_dir/$component_name.stories.tsx"
    cat > "$story_file" << EOF
import type { Meta, StoryObj } from '@storybook/react';
import { ${component_name} } from './${component_name}';

const meta: Meta<typeof ${component_name}> = {
  title: 'Components/${component_name}',
  component: ${component_name},
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

    # 生成样式文件
    local style_file="$component_dir/$component_name.module.css"
    cat > "$style_file" << EOF
.${component_name,,} {
  /* 组件样式 */
}
EOF

    # 生成导出文件
    local index_file="$component_dir/index.ts"
    cat > "$index_file" << EOF
export { ${component_name} } from './${component_name}';
export type { ${component_name}Props } from './${component_name}';
EOF

    # 生成 README 文件
    local readme_file="$component_dir/README.md"
    cat > "$readme_file" << EOF
# ${component_name}

${REQUIREMENT}

## 用法

\`\`\`tsx
import { ${component_name} } from './${component_name}';

<${component_name}>
  Content here
</${component_name}>
\`\`\`

## Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| className | string | - | 自定义类名 |
| children | ReactNode | - | 子元素 |

## 开发

- 组件文件: \`${component_name}.tsx\`
- 测试文件: \`${component_name}.test.tsx\`
- 故事文件: \`${component_name}.stories.tsx\`
- 样式文件: \`${component_name}.module.css\`
EOF

    # 更新项目导入
    if [[ "$TARGET_PROJECT" != "shared" ]]; then
        log_step "更新项目导入..."
        local components_index="frontends/$TARGET_PROJECT/src/components/index.ts"
        if [[ -f "$components_index" ]]; then
            echo "export { ${component_name} } from './${component_name}';" >> "$components_index"
        else
            echo "export { ${component_name} } from './${component_name}';" > "$components_index"
        fi
    fi

    # 运行测试
    log_step "运行测试..."
    if [[ -f "frontends/$TARGET_PROJECT/package.json" ]]; then
        cd "frontends/$TARGET_PROJECT"
        npm test -- --testPathPattern="$component_name" --passWithNoTests || log_warning "测试运行失败"
        cd "$PROJECT_ROOT"
    fi

    # 显示结果
    log_success "组件创建完成!"
    echo ""
    echo -e "${CYAN}📁 组件位置:${NC} $component_dir"
    echo -e "${CYAN}📝 组件文件:${NC}"
    echo "  - $component_name.tsx (主组件)"
    echo "  - $component_name.test.tsx (测试)"
    echo "  - $component_name.stories.tsx (Storybook)"
    echo "  - $component_name.module.css (样式)"
    echo "  - index.ts (导出)"
    echo "  - README.md (文档)"
    echo ""
    echo -e "${CYAN}🚀 下一步:${NC}"
    echo "1. 查看生成的组件代码"
    echo "2. 运行测试: npm test"
    echo "3. 启动 Storybook: npm run storybook"
    echo "4. 在项目中使用组件"

    if [[ "$VERBOSE" == "true" ]]; then
        echo ""
        echo -e "${CYAN}📋 AI 响应:${NC}"
        echo "$response"
    fi
}

# 执行主函数
main "$@"
