# crypto.tion.work - 加密货币投资导航站

专为加密货币投资者而生，聚合优质网站、教程、工具，一站式加密货币投资导航平台。

## 🚀 功能特性

### 五大核心功能

1. **🔗 加密货币网站聚合**

   - 交易所导航（币安、欧易、Coinbase 等）
   - DeFi 协议导航（Uniswap、Compound、Aave 等）
   - 数据分析平台（CoinGecko、CoinMarketCap 等）
   - 区块链浏览器（Etherscan、BSCScan 等）

2. **📚 加密货币教程中心**

   - 新手入门教程
   - 钱包使用指南
   - DeFi 操作教程
   - NFT 交易教程
   - 安全防护指南

3. **🛠️ 专业工具集合**

   - 收益计算器
   - DCA 定投计算器
   - 复利计算器
   - FIRE 财务自由规划
   - 地址验证工具
   - 安全检测工具

4. **📊 市场数据看板**

   - 实时价格
   - 市场趋势
   - 热门项目
   - 新闻资讯

5. **🎓 学习资源**
   - 精选文章
   - 视频教程
   - 白皮书库
   - 社区资源

## 🛠️ 技术栈

- **前端框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **动画**: Framer Motion
- **类型检查**: TypeScript
- **代码质量**: ESLint

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3006
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   └── tools/             # 工具页面
│       ├── calculator/    # 收益计算器
│       └── dca/          # DCA定投计算器
├── components/            # 组件
│   ├── layout/           # 布局组件
│   │   ├── Header.tsx    # 头部导航
│   │   └── Footer.tsx    # 底部信息
│   └── ui/               # UI组件
│       ├── Button.tsx    # 按钮组件
│       ├── Card.tsx      # 卡片组件
│       └── Input.tsx     # 输入框组件
└── lib/                  # 工具函数
    └── utils.ts          # 通用工具函数
```

## 🎯 核心工具

### 收益计算器

- 计算投资收益率
- 支持初始投资和定期投资
- 复利计算
- 可视化结果展示

### DCA 定投计算器

- 定期定额投资策略计算
- 成本平均效应分析
- 价格波动模拟
- 收益对比分析

## 🌟 特色功能

- **零注册使用**: 无需注册即可使用所有功能
- **实时更新**: 定期更新最新资源和工具
- **新手友好**: 专门为投资新手设计
- **完全免费**: 100%免费使用
- **响应式设计**: 支持所有设备访问

## 📱 部署

### Netlify 部署

```bash
# 构建项目
npm run build

# 部署到Netlify
netlify deploy --prod --dir=.next
```

### 使用 Makefile

```bash
# 从项目根目录
make deploy-crypto
```

## 🔗 相关链接

- **主站**: https://tion.work
- **开发工具站**: https://dev.tion.work
- **加密货币导航站**: https://crypto.tion.work
- **API 文档**: https://api.tion.work/docs

## 📄 许可证

MIT License - 详见 [LICENSE](../../LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## ⚠️ 免责声明

本网站提供的所有信息、工具和计算器仅供参考，不构成投资建议。加密货币投资存在风险，请谨慎决策。
