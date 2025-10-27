# 🚀 Vercel 部署迁移指南

## 📋 目录
1. [准备工作](#准备工作)
2. [配置 Vercel 项目](#配置-vercel-项目)
3. [环境变量设置](#环境变量设置)
4. [部署流程](#部署流程)
5. [验证部署](#验证部署)
6. [常见问题](#常见问题)

---

## 🎯 准备工作

### 1. 注册 Vercel 账号
- 访问 [https://vercel.com](https://vercel.com)
- 使用 GitHub 账号登录（推荐）
- 授权 Vercel 访问你的 GitHub 仓库

### 2. 确保代码已推送到 GitHub
```bash
cd /Users/yuanzexiang/billLog_h5
git status
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3. 检查项目配置
项目已经包含以下 Vercel 配置文件：
- ✅ `vercel.json` - Vercel 配置文件
- ✅ `.vercelignore` - 忽略文件配置
- ✅ `next.config.mjs` - Next.js 配置

---

## 🔧 配置 Vercel 项目

### 方式一：通过 Vercel 网站部署（推荐）

#### 第 1 步：导入项目
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New..." → "Project"**
3. 选择你的 GitHub 账号
4. 找到 `billLog_h5` 仓库
5. 点击 **"Import"**

#### 第 2 步：配置项目设置
在配置页面设置以下内容：

**Project Name（项目名称）：**
```
billlog-h5
```

**Framework Preset（框架预设）：**
```
Next.js
```

**Root Directory（根目录）：**
```
./
```

**Build Command（构建命令）：**
```
npm run build
```

**Output Directory（输出目录）：**
```
.next
```

**Install Command（安装命令）：**
```
npm install
```

#### 第 3 步：配置环境变量
点击 **"Environment Variables"** 部分，添加以下变量：

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` | Production, Preview, Development |
| `GLM_API_KEY` | `你的GLM API Key`（如果有） | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc` | Production, Preview, Development |
| `ENABLE_STREAMING` | `true` | Production, Preview, Development |

**注意事项：**
- 所有变量都要勾选 **Production**、**Preview** 和 **Development** 环境
- 不要添加引号，直接粘贴值
- `NEXT_PUBLIC_` 开头的变量会暴露到客户端
- Vercel 完美支持 SSE 流式响应，所以设置 `ENABLE_STREAMING=true`

#### 第 4 步：部署
点击 **"Deploy"** 按钮开始部署！

---

### 方式二：通过 Vercel CLI 部署

#### 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 登录 Vercel
```bash
vercel login
```

#### 部署项目
```bash
cd /Users/yuanzexiang/billLog_h5

# 首次部署（会引导你配置）
vercel

# 按照提示操作：
# ? Set up and deploy "~/billLog_h5"? [Y/n] y
# ? Which scope do you want to deploy to? Your username
# ? Link to existing project? [y/N] n
# ? What's your project's name? billlog-h5
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n
```

#### 设置环境变量（CLI 方式）
```bash
# 设置生产环境变量
vercel env add DEEPSEEK_API_KEY production
vercel env add GLM_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ENABLE_STREAMING production

# 设置预览环境变量
vercel env add DEEPSEEK_API_KEY preview
vercel env add GLM_API_KEY preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add ENABLE_STREAMING preview
```

按提示输入每个变量的值。

#### 部署到生产环境
```bash
vercel --prod
```

---

## 📦 环境变量设置

### 在 Vercel Dashboard 中管理环境变量

1. 进入项目页面：[https://vercel.com/dashboard](https://vercel.com/dashboard)
2. 选择你的 `billlog-h5` 项目
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加/编辑/删除环境变量

### 环境变量说明

| 变量名 | 用途 | 是否必需 |
|-------|------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek AI API 密钥 | ✅ 必需 |
| `GLM_API_KEY` | GLM AI API 密钥（备用） | ❌ 可选 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ 必需 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ 必需 |
| `ENABLE_STREAMING` | 启用流式响应 | ✅ 推荐设为 `true` |

**⚠️ 安全提示：**
- `NEXT_PUBLIC_` 前缀的变量会暴露到浏览器
- 不要在客户端代码中使用敏感的 API 密钥
- API 调用应该通过 Next.js API Routes 进行

---

## 🚀 部署流程

### 自动部署（Git 集成）
Vercel 会自动监听 Git 仓库的变化：

- **推送到 `main` 分支** → 自动部署到生产环境
- **推送到其他分支** → 自动创建预览部署
- **Pull Request** → 自动创建预览部署并添加评论

```bash
# 日常开发流程
git add .
git commit -m "Update feature"
git push origin main
# Vercel 会自动开始部署！
```

### 手动部署
在 Vercel Dashboard 中：
1. 进入项目页面
2. 点击 **"Deployments"** 标签
3. 点击 **"Redeploy"** 按钮

### 查看部署日志
1. 进入 **"Deployments"** 页面
2. 点击某个部署记录
3. 查看 **"Building"** 和 **"Runtime Logs"**

---

## ✅ 验证部署

### 1. 检查部署状态
```bash
# 使用 CLI 检查
vercel ls

# 查看最新部署的详细信息
vercel inspect
```

### 2. 访问生产环境
部署成功后，Vercel 会提供：
- **生产域名：** `https://billlog-h5.vercel.app`
- **自定义域名：** 可在 Settings → Domains 中配置

### 3. 测试关键功能
访问你的应用并测试：
- ✅ 用户登录/注册
- ✅ 添加账单记录
- ✅ 图片上传功能
- ✅ AI 分析功能（检查流式响应）
- ✅ 统计图表
- ✅ CSV 导出

### 4. 检查 API 路由
在浏览器控制台测试 API：
```javascript
// 测试 AI 分析 API
fetch('/api/ai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: '测试消息' 
  })
})
.then(res => res.json())
.then(console.log)
```

### 5. 查看环境变量
创建测试 API 路由来验证环境变量：
访问 `/api/test-env` 查看配置状态

---

## 🔥 Vercel 相比 AWS Amplify 的优势

| 特性 | Vercel | AWS Amplify |
|-----|--------|-------------|
| **部署速度** | ⚡ 极快（~30秒） | 🐌 较慢（~5分钟） |
| **流式响应（SSE）** | ✅ 完美支持 | ❌ 不支持 |
| **边缘函数** | ✅ 支持 | 部分支持 |
| **自动预览部署** | ✅ 每个 PR 自动部署 | 需配置 |
| **全球 CDN** | ✅ 自动配置 | ✅ 支持 |
| **环境变量管理** | ✅ 简单直观 | 需要 SSM 权限 |
| **日志查看** | ✅ 实时查看 | 需要 CloudWatch |
| **自定义域名** | ✅ 免费 SSL | ✅ 免费 SSL |
| **价格** | 💰 免费套餐慷慨 | 💰 免费套餐有限 |

---

## ❓ 常见问题

### Q1: 环境变量未生效？
**解决方案：**
1. 确认变量名完全一致（区分大小写）
2. 重新部署项目：`vercel --prod`
3. 清除浏览器缓存

### Q2: 构建失败？
**检查项：**
```bash
# 本地测试构建
npm run build

# 查看 Vercel 构建日志
vercel logs [deployment-url]
```

### Q3: API 路由返回 500 错误？
**排查步骤：**
1. 检查 Vercel Dashboard → Deployments → Runtime Logs
2. 确认所有环境变量已设置
3. 检查 API Key 是否有效

### Q4: 图片上传失败？
**确认：**
- Supabase Storage 配置正确
- 图片大小符合限制
- CORS 配置允许 Vercel 域名

### Q5: 如何回滚部署？
**操作：**
1. 进入 **Deployments** 页面
2. 找到之前的成功部署
3. 点击三点菜单 → **"Promote to Production"**

### Q6: 如何添加自定义域名？
**步骤：**
1. Settings → Domains
2. 输入你的域名（如 `billlog.example.com`）
3. 按照提示配置 DNS 记录
4. 等待 SSL 证书自动配置

### Q7: 部署后 Supabase 连接失败？
**检查：**
1. Supabase 项目是否暂停
2. URL 和 Key 是否正确
3. Supabase API 设置中是否允许 Vercel 域名

---

## 🎉 部署完成后

### 清理 AWS Amplify 资源（可选）
如果确认 Vercel 部署成功，可以：
1. 保留 AWS Amplify 项目作为备份
2. 或删除 AWS Amplify 应用释放资源

### 更新文档
记得更新 README.md 中的部署链接：
```markdown
🚀 **Live Demo:** https://billlog-h5.vercel.app
```

### 设置通知
在 Vercel Settings → Notifications 中：
- 启用部署成功/失败通知
- 连接 Slack/Discord（可选）

---

## 📚 参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [环境变量最佳实践](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 💡 下一步建议

1. **配置自定义域名**
   - 让应用拥有专属域名

2. **设置分析和监控**
   - Vercel Analytics（免费）
   - Vercel Speed Insights

3. **优化性能**
   - 启用图片优化
   - 配置缓存策略

4. **设置 CI/CD**
   - GitHub Actions 自动化测试
   - 部署前运行 Lint 检查

---

**🎊 祝你部署成功！有问题随时问我。**

