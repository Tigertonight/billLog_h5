# ⚡ Vercel 快速部署指南（5分钟完成）

如果你想最快速度部署到 Vercel，按照这个精简指南操作。

---

## 🚀 方法一：一键部署（最简单）

### 1. 点击部署按钮

访问 [Vercel Dashboard](https://vercel.com/new) 并导入 GitHub 仓库

### 2. 添加环境变量

在部署配置页面，添加这些环境变量：

```bash
DEEPSEEK_API_KEY=sk-33078fa507a14793bbc0df642824183e
NEXT_PUBLIC_SUPABASE_URL=https://lfibizlmcpgdgifkpgst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc
ENABLE_STREAMING=true
```

记得勾选所有环境（Production + Preview + Development）

### 3. 点击 Deploy

等待 1-2 分钟，完成！ 🎉

---

## 💻 方法二：命令行部署

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录
```bash
vercel login
```

### 3. 部署
```bash
cd /Users/yuanzexiang/billLog_h5
vercel
```

按提示操作，第一次会问你几个问题，都选默认即可。

### 4. 添加环境变量
在 [Vercel Dashboard](https://vercel.com/dashboard) 的项目设置中添加环境变量，或使用命令：

```bash
vercel env add DEEPSEEK_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add ENABLE_STREAMING
```

### 5. 重新部署
```bash
vercel --prod
```

完成！🎊

---

## 📋 环境变量清单

复制粘贴这些值到 Vercel：

| 变量名 | 值 |
|-------|-----|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc` |
| `ENABLE_STREAMING` | `true` |
| `GLM_API_KEY` | （可选）如果有就填 |

---

## ✅ 部署后验证

访问你的 Vercel 域名（类似 `https://billlog-h5.vercel.app`）

测试这些功能：
- ✅ 页面能正常打开
- ✅ 能登录/注册
- ✅ 能添加账单
- ✅ AI 分析功能正常

---

## 🆘 遇到问题？

### 构建失败
```bash
# 本地先测试
npm run build
```

### API 报错
1. 检查环境变量是否都设置了
2. 查看 Vercel Dashboard → Deployments → Runtime Logs

### 需要帮助
查看详细文档：`VERCEL_MIGRATION_GUIDE.md`

---

**就这么简单！现在开始部署吧！** 🚀

