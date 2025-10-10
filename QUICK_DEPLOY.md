# ⚡ TiON.Work 快速部署

## 🚀 一键部署命令

```bash
# 1. 安装部署工具
npm install -g @railway/cli netlify-cli

# 2. 登录服务
railway login
netlify login

# 3. 一键部署所有项目
./scripts/deploy.sh all
```

## 📋 部署清单

### ✅ 后端部署 (Railway)

- [ ] 安装 Railway CLI: `npm install -g @railway/cli`
- [ ] 登录 Railway: `railway login`
- [ ] 创建项目: `cd backend && railway init`
- [ ] 设置环境变量 (见下方)
- [ ] 部署: `railway up`

### ✅ 前端部署 (Netlify)

- [ ] 安装 Netlify CLI: `npm install -g netlify-cli`
- [ ] 登录 Netlify: `netlify login`
- [ ] 部署工具站: `cd frontends/dev && netlify init && netlify deploy --prod --dir=.next`
- [ ] 配置域名: `dev.tion.work`

## 🔧 环境变量配置

### Railway 环境变量

```bash
NODE_ENV=production
DATABASE_URL=你的PostgreSQL连接字符串
REDIS_URL=你的Redis连接字符串
JWT_SECRET=随机生成的JWT密钥
CORS_ORIGIN=https://dev.tion.work
```

### 设置方法

```bash
# 在 Railway 控制台或使用 CLI
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=your-postgresql-url
railway variables set REDIS_URL=your-redis-url
railway variables set JWT_SECRET=your-jwt-secret
railway variables set CORS_ORIGIN=https://dev.tion.work
```

## 🌐 域名配置

### DNS 记录

```
api.tion.work    → Railway 提供的域名
dev.tion.work    → Netlify 提供的域名
```

### 获取域名

```bash
# 获取 Railway 域名
railway domain

# 获取 Netlify 域名
netlify sites:list
```

## 🧪 测试部署

```bash
# 测试后端
curl https://api.tion.work/api/health

# 测试前端
open https://dev.tion.work
```

## 📞 需要帮助？

查看完整部署指南：`DEPLOYMENT_GUIDE.md`

---

**预计部署时间：15-30 分钟** ⏱️
