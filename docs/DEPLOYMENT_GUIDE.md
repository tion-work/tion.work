# 🚀 TiON.Work 部署指南

## 📋 部署架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Netlify CDN   │    │   Railway       │    │   PostgreSQL    │
│                 │    │                 │    │   + Redis       │
│ dev.tion.work   │◄──►│ api.tion.work   │◄──►│   (你的服务)    │
│ (前端工具站)     │    │ (后端API)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ 部署前准备

### 1. 安装必要工具

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 安装 Netlify CLI
npm install -g netlify-cli

# 验证安装
railway --version
netlify --version
```

### 2. 准备环境变量

复制 `env.production.example` 为 `.env.production` 并填入真实值：

```bash
cp env.production.example .env.production
```

**重要环境变量：**

- `DATABASE_URL`: 你的 PostgreSQL 连接字符串
- `REDIS_URL`: 你的 Redis 连接字符串
- `JWT_SECRET`: 随机生成的 JWT 密钥
- `ENCRYPTION_KEY`: 随机生成的加密密钥

## 🚂 部署后端到 Railway

### 1. 登录 Railway

```bash
railway login
```

### 2. 创建新项目

```bash
cd backend
railway init
```

### 3. 配置环境变量

在 Railway 控制台中设置环境变量：

```bash
# 在 Railway 控制台或使用 CLI
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=your-postgresql-url
railway variables set REDIS_URL=your-redis-url
railway variables set JWT_SECRET=your-jwt-secret
railway variables set CORS_ORIGIN=https://dev.tion.work
```

### 4. 部署

```bash
railway up
```

### 5. 获取部署 URL

```bash
railway domain
# 记录返回的URL，如：https://api.tion.work
```

## 🌐 部署前端到 Netlify

### 1. 登录 Netlify

```bash
netlify login
```

### 2. 部署工具站 (dev.tion.work)

```bash
cd frontends/dev
netlify init
netlify deploy --prod --dir=.next
```

### 3. 配置自定义域名

在 Netlify 控制台中：

1. 进入站点设置
2. 添加自定义域名：`dev.tion.work`
3. 配置 DNS 记录指向 Netlify

### 4. 部署其他前端项目

```bash
# 管理后台
cd frontends/admin
netlify init
netlify deploy --prod --dir=.next

# 文档站点
cd frontends/docs
netlify init
netlify deploy --prod --dir=.next

# 主站
cd frontends/index
netlify init
netlify deploy --prod --dir=.next

# 移动端
cd frontends/mobile
netlify init
netlify deploy --prod --dir=.next
```

## 🔧 使用部署脚本

我们提供了自动化部署脚本：

```bash
# 检查部署要求
./scripts/deploy.sh check

# 构建所有项目
./scripts/deploy.sh build

# 部署后端
./scripts/deploy.sh backend

# 部署指定前端
./scripts/deploy.sh frontend dev

# 部署开发环境 (后端 + dev前端)
./scripts/deploy.sh dev

# 部署所有项目
./scripts/deploy.sh all
```

## 🌍 域名配置

### DNS 记录设置

```
# A 记录
api.tion.work    → Railway IP
dev.tion.work    → Netlify IP
admin.dev.tion.work → Netlify IP
docs.dev.tion.work  → Netlify IP
tion.work        → Netlify IP
m.dev.tion.work  → Netlify IP

# CNAME 记录 (如果使用)
api.tion.work    → railway.app
dev.tion.work    → netlify.app
```

### SSL 证书

- **Railway**: 自动提供 SSL 证书
- **Netlify**: 自动提供 SSL 证书

## 🧪 测试部署

### 1. 测试后端 API

```bash
# 健康检查
curl https://api.tion.work/api/health

# 获取工具列表
curl https://api.tion.work/api/tools
```

### 2. 测试前端

访问以下 URL 确认正常：

- https://dev.tion.work (工具站)
- https://admin.dev.tion.work (管理后台)
- https://docs.dev.tion.work (文档站点)
- https://tion.work (主站)
- https://m.dev.tion.work (移动端)

### 3. 测试工具功能

1. 打开 https://dev.tion.work
2. 搜索工具
3. 点击工具进入详情页
4. 测试工具功能
5. 确认 API 调用正常

## 📊 监控和日志

### Railway 监控

- 访问 Railway 控制台查看服务状态
- 查看日志：`railway logs`
- 监控资源使用情况

### Netlify 监控

- 访问 Netlify 控制台查看部署状态
- 查看构建日志
- 监控访问统计

## 🔄 持续部署

### 自动部署设置

1. **Railway**: 连接 GitHub 仓库，自动部署 main 分支
2. **Netlify**: 连接 GitHub 仓库，自动部署 main 分支

### 手动部署

```bash
# 更新代码后
git push origin main

# 或使用脚本
./scripts/deploy.sh all
```

## 🚨 故障排除

### 常见问题

1. **API 404 错误**

   - 检查 CORS 配置
   - 确认 API URL 正确

2. **前端构建失败**

   - 检查 Node.js 版本
   - 清理 node_modules 重新安装

3. **数据库连接失败**

   - 检查 DATABASE_URL 格式
   - 确认数据库服务可访问

4. **域名解析问题**
   - 检查 DNS 记录
   - 等待 DNS 传播（最多 24 小时）

### 调试命令

```bash
# 检查后端日志
railway logs

# 检查前端构建
cd frontends/dev && npm run build

# 检查环境变量
railway variables

# 重启服务
railway restart
```

## 📈 性能优化

### 前端优化

- 启用 Netlify CDN
- 配置缓存策略
- 启用 Gzip 压缩

### 后端优化

- 配置 Redis 缓存
- 启用数据库连接池
- 设置适当的超时时间

## 🔒 安全配置

### 环境变量安全

- 使用强密码
- 定期轮换密钥
- 不要在代码中硬编码敏感信息

### 网络安全

- 配置 CORS 策略
- 启用 HTTPS
- 设置安全头

## 📞 支持

如果遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 确认服务状态
4. 联系技术支持

---

**部署完成后，你的 TiON.Work 工具站将在以下地址可用：**

- 🛠️ **工具站**: https://dev.tion.work
- 🔧 **管理后台**: https://admin.dev.tion.work
- 📚 **文档站点**: https://docs.dev.tion.work
- 🏠 **主站**: https://tion.work
- 📱 **移动端**: https://m.dev.tion.work
- 🔌 **API**: https://api.tion.work
