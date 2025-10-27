# 🚀 Vercel CLI 部署指南

## 第 1 步：登录 Vercel

在你的终端执行：

```bash
cd /Users/yuanzexiang/billLog_h5
vercel login
```

**操作步骤：**
1. 浏览器会自动打开授权页面
2. 选择 **Continue with GitHub**（推荐）
3. 授权 Vercel 访问你的 GitHub
4. 看到 "Success! Vercel CLI is now authenticated" 后关闭浏览器
5. 回到终端，会显示 "Congratulations! You are now logged in."

---

## 第 2 步：首次部署（预览环境）

登录成功后，执行：

```bash
vercel
```

**会提示以下问题，按这样回答：**

```
? Set up and deploy "~/billLog_h5"? [Y/n] 
👉 输入: Y (或直接按回车)

? Which scope do you want to deploy to? 
👉 选择: 你的用户名（默认选项）

? Link to existing project? [y/N] 
👉 输入: N (创建新项目)

? What's your project's name? 
👉 输入: billlog-h5 (或直接回车使用默认)

? In which directory is your code located? 
👉 输入: ./ (或直接回车)

? Want to override the settings? [y/N] 
👉 输入: N (使用默认设置)
```

等待构建完成，你会看到：
```
✅ Deployment ready
🔗 Preview: https://billlog-h5-xxx.vercel.app
```

---

## 第 3 步：添加环境变量

### 方式 A：通过 CLI 添加（每个变量单独添加）

```bash
# 添加 DEEPSEEK_API_KEY
vercel env add DEEPSEEK_API_KEY production
# 输入值: sk-33078fa507a14793bbc0df642824183e

vercel env add DEEPSEEK_API_KEY preview
# 输入值: sk-33078fa507a14793bbc0df642824183e

# 添加 SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 输入值: https://lfibizlmcpgdgifkpgst.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# 输入值: https://lfibizlmcpgdgifkpgst.supabase.co

# 添加 SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 输入值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
# 输入值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc

# 添加 ENABLE_STREAMING
vercel env add ENABLE_STREAMING production
# 输入值: true

vercel env add ENABLE_STREAMING preview
# 输入值: true
```

### 方式 B：通过网页添加（推荐，更快）

```bash
# 打开项目设置页面
vercel project ls
# 复制项目名称，然后访问：
# https://vercel.com/你的用户名/billlog-h5/settings/environment-variables
```

在网页中粘贴这些环境变量：

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc` | Production, Preview |
| `ENABLE_STREAMING` | `true` | Production, Preview |

---

## 第 4 步：部署到生产环境

环境变量设置完成后：

```bash
vercel --prod
```

等待 1-2 分钟，完成！🎉

你会看到：
```
✅ Production deployment ready
🌐 https://billlog-h5.vercel.app
```

---

## 🔍 常用命令

```bash
# 查看登录状态
vercel whoami

# 查看所有部署
vercel ls

# 查看项目详情
vercel inspect --prod

# 查看实时日志
vercel logs --follow

# 查看环境变量
vercel env ls

# 删除部署
vercel remove [deployment-url]

# 切换项目
vercel switch

# 帮助
vercel --help
```

---

## ✅ 部署成功检查清单

- [ ] 能看到生产环境 URL
- [ ] 访问 URL，网站能正常打开
- [ ] 用户登录功能正常
- [ ] AI 流式分析功能正常（重点！）
- [ ] 图片上传功能正常
- [ ] 统计图表显示正常

---

## 🐛 常见问题

### 登录失败
```bash
# 清除凭证重新登录
rm -rf ~/.vercel
vercel login
```

### 构建失败
```bash
# 本地测试构建
npm run build

# 查看详细错误
vercel logs [deployment-url]
```

### 环境变量未生效
```bash
# 确认环境变量已添加
vercel env ls

# 重新部署
vercel --prod --force
```

### API 报错
1. 检查环境变量是否都设置了
2. 查看 Vercel Dashboard 的 Runtime Logs
3. 确认 API Key 有效

---

## 🎯 下次部署

以后每次推送代码到 GitHub，Vercel 会自动部署！

或者手动部署：
```bash
cd /Users/yuanzexiang/billLog_h5
git add .
git commit -m "Update"
git push
vercel --prod
```

---

## 📊 监控和分析

```bash
# 查看实时日志
vercel logs --follow

# 查看特定部署的日志
vercel logs https://billlog-h5.vercel.app

# 在浏览器中查看
vercel inspect --prod
```

---

**祝你部署成功！** 🚀

有问题随时查看：`VERCEL_MIGRATION_GUIDE.md`

