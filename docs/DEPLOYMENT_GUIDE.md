# tion.work 部署指南

## 🚀 部署架构

### 平台选择
- **前端**: Netlify (静态站点 + 边缘函数)
- **后端**: Railway (Node.js 应用 + 数据库)
- **域名**: tion.work
- **CDN**: Netlify CDN (全球加速)

### 架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户访问       │    │   Netlify CDN   │    │   Railway API   │
│   tion.work     │◄──►│   (全球加速)     │◄──►│   (后端服务)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Netlify       │    │   Railway       │
                       │   (前端托管)     │    │   (数据库)       │
                       └─────────────────┘    └─────────────────┘
```

## 🎨 前端部署 (Netlify)

### 1. 项目配置

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "https://tion-work-api.railway.app/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[functions]
  directory = "netlify/functions"
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://tion-work-api.railway.app'
  }
}

module.exports = nextConfig
```

### 2. 环境变量配置

#### 在 Netlify 控制台设置
```bash
# 生产环境变量
NEXT_PUBLIC_API_URL=https://tion-work-api.railway.app
NEXT_PUBLIC_APP_URL=https://tion.work
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3. 构建优化

#### package.json 脚本
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "netlify deploy --prod",
    "dev": "next dev",
    "preview": "netlify dev"
  }
}
```

### 4. 部署步骤

#### 自动部署 (推荐)
1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令: `npm run build`
3. 设置发布目录: `.next`
4. 配置环境变量
5. 启用自动部署

#### 手动部署
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化项目
netlify init

# 构建和部署
npm run build
netlify deploy --prod
```

## ⚙️ 后端部署 (Railway)

### 1. 项目配置

#### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Dockerfile (可选)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"]
```

### 2. 环境变量配置

#### 在 Railway 控制台设置
```bash
# 应用配置
NODE_ENV=production
PORT=3001
API_URL=https://tion-work-api.railway.app

# 数据库配置
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://user:password@host:port

# 安全配置
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://tion.work

# 监控配置
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 3. 数据库配置

#### PostgreSQL 设置
```sql
-- 创建数据库
CREATE DATABASE tion_work;

-- 创建用户
CREATE USER tion_work_user WITH PASSWORD 'secure_password';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE tion_work TO tion_work_user;

-- 创建表
\c tion_work;

CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id),
  user_ip VARCHAR(45),
  processing_time INTEGER,
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. 部署步骤

#### 自动部署 (推荐)
1. 连接 GitHub 仓库到 Railway
2. 选择 Node.js 模板
3. 配置环境变量
4. 添加 PostgreSQL 插件
5. 添加 Redis 插件
6. 部署应用

#### 手动部署
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 部署
railway up
```

## 🔧 CI/CD 配置

### GitHub Actions 工作流

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run linting
        run: npm run lint
      
      - name: Build frontend
        run: cd frontend && npm run build
      
      - name: Build backend
        run: cd backend && npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './frontend/.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: railwayapp/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: tion-work-api
```

## 📊 监控和日志

### 1. 应用监控

#### Sentry 配置
```javascript
// frontend/src/lib/sentry.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

```javascript
// backend/src/lib/sentry.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. 性能监控

#### 前端性能监控
```javascript
// frontend/src/lib/analytics.js
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

### 3. 日志配置

#### 后端日志
```javascript
// backend/src/lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tion-work-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## 🔒 安全配置

### 1. 域名和 SSL

#### Netlify 配置
- 自动 SSL 证书
- 强制 HTTPS 重定向
- 安全头设置

#### Railway 配置
- 自动 SSL 证书
- 环境变量加密
- 网络隔离

### 2. 环境变量安全

```bash
# 敏感信息使用 Railway 环境变量
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
SENTRY_DSN=...

# 公开信息使用 Netlify 环境变量
NEXT_PUBLIC_API_URL=https://tion-work-api.railway.app
NEXT_PUBLIC_APP_URL=https://tion.work
```

## 📈 性能优化

### 1. 前端优化

#### Next.js 配置
```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

#### 缓存策略
```toml
# netlify.toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. 后端优化

#### 数据库连接池
```javascript
// backend/src/lib/database.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

## 🚀 部署检查清单

### 部署前检查
- [ ] 所有测试通过
- [ ] 环境变量配置正确
- [ ] 数据库迁移完成
- [ ] SSL 证书有效
- [ ] 监控系统配置
- [ ] 备份策略就绪

### 部署后检查
- [ ] 应用正常启动
- [ ] API 接口响应正常
- [ ] 数据库连接正常
- [ ] 监控数据正常
- [ ] 性能指标达标
- [ ] 安全扫描通过

## 🔄 回滚策略

### 前端回滚 (Netlify)
```bash
# 查看部署历史
netlify sites:list

# 回滚到指定部署
netlify rollback [deploy-id]
```

### 后端回滚 (Railway)
```bash
# 查看部署历史
railway status

# 回滚到上一个版本
railway rollback
```

---

*部署配置将根据项目发展持续更新*
