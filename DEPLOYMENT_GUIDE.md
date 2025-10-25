# 🚀 部署指南

## 架构说明

本项目采用 **Supabase + AWS Amplify** 的架构：
- **Supabase**：数据库存储 + 文件存储
- **AWS Amplify**：应用托管 + CDN + 自动部署

---

## ✅ 已完成的改造

### 1. 数据存储迁移
- ❌ ~~CSV 文件存储（本地文件系统）~~
- ✅ Supabase PostgreSQL 数据库

### 2. 图片存储迁移
- ❌ ~~public/images/ 目录~~
- ✅ Supabase Storage（CDN 加速）

### 3. API 改造
- ✅ GET `/api/csv/[userId]` - 查询交易记录
- ✅ POST `/api/csv/[userId]` - 添加交易记录
- ✅ PUT `/api/csv/[userId]/[transactionId]` - 更新交易记录
- ✅ DELETE `/api/csv/[userId]/[transactionId]` - 删除交易记录
- ✅ POST `/api/upload` - 上传图片到 Supabase Storage

---

## 📋 环境变量配置

### 本地开发（.env.local）
```env
# DeepSeek API - AI 分析
DEEPSEEK_API_KEY=sk-xxxxx

# 智谱 GLM API - 图片识别
GLM_API_KEY=xxxxx

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://lfibizlmcpgdgifkpgst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

### AWS Amplify 部署
在 Amplify 控制台添加相同的环境变量（Environment variables）

---

## 🗄️ Supabase 配置

### 数据库表结构

#### transactions 表
```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  note TEXT DEFAULT '',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 存储桶
- **Bucket Name**: `transaction-images`
- **Public Access**: ✅ Enabled
- **File Size Limit**: 10MB
- **Allowed Types**: PNG, JPG, SVG, PDF

---

## 🚀 部署到 AWS Amplify

### 步骤 1：推送代码到 GitHub
```bash
git add .
git commit -m "feat: migrate to Supabase + prepare for Amplify deployment"
git push origin main
```

### 步骤 2：在 AWS Amplify 创建应用
1. 登录 AWS 控制台
2. 搜索并打开 "Amplify"
3. 点击 "New app" → "Host web app"
4. 选择 GitHub 并授权
5. 选择仓库和分支
6. 配置构建设置（自动检测 Next.js）
7. 添加环境变量
8. 部署

### 步骤 3：配置环境变量
在 Amplify 控制台的 Environment variables 中添加：
- `DEEPSEEK_API_KEY`
- `GLM_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ 部署检查清单

### 部署前
- [ ] Supabase 项目已创建
- [ ] 数据库表已创建
- [ ] 存储桶已配置
- [ ] 环境变量已准备好
- [ ] 代码已推送到 GitHub

### 部署后
- [ ] 网站可以访问
- [ ] 记账功能正常
- [ ] 数据可以保存到 Supabase
- [ ] 图片上传功能正常
- [ ] AI 分析功能正常

---

## 🔧 故障排查

### 问题 1：Supabase 连接失败
**检查**：
- 环境变量是否正确配置
- URL 和 Anon Key 是否有效
- Supabase 项目是否正常运行

### 问题 2：图片上传失败
**检查**：
- Storage bucket 是否已创建
- Bucket 访问策略是否正确
- 文件大小是否超过限制

### 问题 3：AI 功能不工作
**检查**：
- API 密钥是否正确
- 是否有足够的配额
- 网络连接是否正常

---

## 💰 成本估算

### Supabase（免费套餐）
- ✅ 500MB 数据库
- ✅ 1GB 文件存储
- ✅ 2GB 带宽/月
- ✅ 完全够用

### AWS Amplify（免费套餐 - 12个月）
- ✅ 1000 分钟构建/月
- ✅ 15GB 存储/月
- ✅ 15GB 流量/月
- ✅ 个人使用完全免费

### AI API
- DeepSeek: 按 token 计费，新用户有免费额度
- GLM: 同样有免费额度

**总计**：对于个人使用，基本上是免费的 ✅

---

## 📞 获取帮助

- Supabase 文档：https://supabase.com/docs
- AWS Amplify 文档：https://docs.amplify.aws/
- Next.js 文档：https://nextjs.org/docs

---

**部署完成后，你的应用将拥有：**
- 🌍 全球 CDN 加速
- 🔒 自动 HTTPS
- 📊 数据持久化
- 📸 图片云存储
- 🚀 自动部署（push 即上线）

