# 环境变量配置指南

## 🔧 环境变量说明

### 前端环境变量 (Netlify)

#### 必需变量
```bash
# API 地址
NEXT_PUBLIC_API_URL=https://tion-work-api.railway.app

# 应用地址
NEXT_PUBLIC_APP_URL=https://tion.work

# 环境
NODE_ENV=production
```

#### 可选变量
```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry 错误追踪
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true
```

### 后端环境变量 (Railway)

#### 必需变量
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
```

#### 可选变量
```bash
# 监控配置
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=tion-work

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 文件存储
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=tion-work-uploads
```

## 🚀 部署配置

### Netlify 环境变量设置

1. 登录 Netlify 控制台
2. 选择你的站点
3. 进入 Site settings > Environment variables
4. 添加以下变量：

```bash
NEXT_PUBLIC_API_URL=https://tion-work-api.railway.app
NEXT_PUBLIC_APP_URL=https://tion.work
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Railway 环境变量设置

1. 登录 Railway 控制台
2. 选择你的项目
3. 进入 Variables 标签
4. 添加以下变量：

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://user:password@host:port
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://tion.work
SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 🔒 安全注意事项

### 敏感信息保护
- 永远不要在代码中硬编码敏感信息
- 使用环境变量存储所有敏感配置
- 定期轮换密钥和密码
- 使用强密码和随机生成的密钥

### 环境变量命名规范
- 前端公开变量使用 `NEXT_PUBLIC_` 前缀
- 后端私有变量不使用特殊前缀
- 使用大写字母和下划线
- 名称要有意义且易于理解

### 密钥生成
```bash
# 生成 JWT Secret
openssl rand -base64 32

# 生成随机密码
openssl rand -base64 16

# 生成 UUID
uuidgen
```

## 📊 环境管理

### 开发环境
```bash
# .env.local (不提交到版本控制)
NODE_ENV=development
API_URL=http://localhost:3001
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost:5432/tion_work
```

### 测试环境
```bash
# 测试环境变量
NODE_ENV=test
API_URL=https://tion-work-api-staging.railway.app
APP_URL=https://staging.tion.work
DATABASE_URL=postgresql://user:password@host:port/tion_work_test
```

### 生产环境
```bash
# 生产环境变量
NODE_ENV=production
API_URL=https://tion-work-api.railway.app
APP_URL=https://tion.work
DATABASE_URL=postgresql://user:password@host:port/tion_work_prod
```

## 🔄 环境变量更新

### 更新 Netlify 变量
```bash
# 使用 Netlify CLI
netlify env:set NEXT_PUBLIC_API_URL https://new-api-url.com

# 或者通过控制台手动更新
```

### 更新 Railway 变量
```bash
# 使用 Railway CLI
railway variables set DATABASE_URL=postgresql://new-url

# 或者通过控制台手动更新
```

## 📝 环境变量检查清单

### 部署前检查
- [ ] 所有必需变量已设置
- [ ] 敏感信息已加密
- [ ] 变量值格式正确
- [ ] 测试环境变量
- [ ] 备份当前配置

### 部署后检查
- [ ] 应用正常启动
- [ ] 数据库连接正常
- [ ] API 接口正常
- [ ] 监控系统正常
- [ ] 日志输出正常

---

*环境变量配置将根据项目发展持续更新*
