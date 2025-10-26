# 🚀 AWS Amplify 部署完整指南

## ✅ 准备工作检查

- [x] Supabase 项目已创建
- [x] 数据库表已创建
- [x] 代码已推送到 GitHub：https://github.com/Tigertonight/billLog_h5
- [x] 环境变量已准备好

---

## 📋 部署步骤

### 第一步：登录 AWS 控制台

1. **访问 AWS 控制台**
   - 打开：https://console.aws.amazon.com/
   - 使用你的 AWS 账号登录

2. **确认区域**
   - 右上角选择一个离你近的区域
   - 推荐：`Asia Pacific (Singapore)` 或 `Asia Pacific (Tokyo)`

---

### 第二步：打开 AWS Amplify

1. **搜索 Amplify**
   - 在顶部搜索框输入 "Amplify"
   - 点击 "AWS Amplify"

2. **创建新应用**
   - 点击 **"New app"**
   - 选择 **"Host web app"**

---

### 第三步：连接 GitHub 仓库

1. **选择 Git 提供商**
   - 选择 **"GitHub"**
   - 点击 **"Continue"**

2. **授权 AWS Amplify**
   - 如果是第一次使用，会弹出 GitHub 授权页面
   - 点击 **"Authorize AWS Amplify"**
   - 可能需要输入 GitHub 密码确认

3. **选择仓库和分支**
   - Repository: 选择 **"Tigertonight/billLog_h5"**
   - Branch: 选择 **"main"**
   - 点击 **"Next"**

---

### 第四步：配置构建设置

1. **应用名称**
   ```
   App name: billlog-h5
   ```

2. **构建设置（自动检测）**
   AWS 会自动检测到这是 Next.js 项目，并生成配置：
   
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```
   
   ✅ 这个配置是正确的，保持默认即可

3. **点击 "Advanced settings"（重要！）**

---

### 第五步：配置环境变量（关键步骤）

在 **"Environment variables"** 部分，添加以下变量：

| Variable name | Value |
|---------------|-------|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` |
| `GLM_API_KEY` | `你的GLM密钥`（如果有的话） |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc` |

**添加方式**：
1. 点击 **"Add environment variable"**
2. 输入 Variable name 和 Value
3. 重复 4 次，添加所有变量

⚠️ **注意**：
- 变量名必须完全一致（区分大小写）
- 不要添加引号
- 直接粘贴值即可

---

### 第六步：配置服务角色

1. **Service role**
   - 如果是第一次使用：选择 **"Create and use a new service role"**
   - 如果之前用过：选择现有的 `amplifyconsole-backend-role`

2. **点击 "Next"**

---

### 第七步：审查并部署

1. **审查配置**
   检查以下内容：
   - ✅ 仓库：`Tigertonight/billLog_h5`
   - ✅ 分支：`main`
   - ✅ 构建设置：Next.js
   - ✅ 环境变量：4 个变量已添加

2. **开始部署**
   - 点击 **"Save and deploy"**
   - 等待部署完成（约 5-8 分钟）

---

## ⏱️ 部署过程

部署分为 4 个阶段：

```
1. Provision    ⏱️ ~1 分钟
   - 准备构建环境
   - 分配资源

2. Build        ⏱️ ~3-5 分钟
   - 克隆代码
   - 安装依赖（npm ci）
   - 构建项目（npm run build）
   
3. Deploy       ⏱️ ~1 分钟
   - 部署到 CDN
   - 配置域名

4. Verify       ⏱️ ~30 秒
   - 验证部署
   - 健康检查
```

**实时查看日志**：
- 点击每个阶段可以查看详细日志
- 如果出错，日志会显示错误信息

---

## ✅ 部署成功

部署完成后，你会看到：

```
✅ Deployment successfully completed

Your app URL:
https://main.xxxxxx.amplifyapp.com
```

### 访问你的应用
1. 点击 URL 链接
2. 应该能看到你的记账应用首页
3. 🎉 恭喜！部署成功！

---

## 🔧 部署后配置

### 1. 自定义域名（可选）

如果你有自己的域名：

1. 在 Amplify 控制台
2. 点击左侧 **"Domain management"**
3. 点击 **"Add domain"**
4. 输入你的域名
5. 按照提示配置 DNS

### 2. 自动部署

✅ 已自动配置！

每次你 push 代码到 GitHub main 分支：
- Amplify 会自动检测
- 自动构建
- 自动部署
- 约 5 分钟后更新生效

### 3. 分支部署（可选）

如果想为 dev 分支创建测试环境：
1. 点击 **"Connect branch"**
2. 选择 `dev` 分支
3. 会创建独立的测试 URL

---

## 📊 监控和管理

### 查看部署历史
- 左侧 **"Deployments"**
- 可以看到所有部署记录
- 可以回滚到之前的版本

### 查看日志
- 点击任意部署
- 查看构建日志
- 排查问题

### 查看指标
- 左侧 **"Monitoring"**
- 查看访问量、错误率等

---

## ⚠️ 常见问题

### 问题 1：构建失败 - "Module not found"
**原因**：依赖安装失败
**解决**：
1. 检查 `package.json` 是否正确
2. 确保本地 `npm run build` 能成功
3. 查看构建日志的详细错误

### 问题 2：部署成功但页面报错
**原因**：环境变量未配置
**解决**：
1. 检查环境变量是否都添加了
2. 变量名是否正确（区分大小写）
3. 重新部署：点击 **"Redeploy this version"**

### 问题 3：Supabase 连接失败
**原因**：Supabase URL 或 Key 错误
**解决**：
1. 检查 Supabase 项目是否正常
2. 确认 URL 和 Anon Key 正确
3. 测试 Supabase 连接

### 问题 4：图片上传失败
**原因**：Supabase Storage 配置问题
**解决**：
1. 检查 Storage bucket 是否创建
2. 检查访问策略是否正确
3. 查看浏览器控制台错误

---

## 🎯 验证清单

部署完成后，请验证以下功能：

### 基础功能
- [ ] 页面能正常访问
- [ ] 明暗模式切换正常
- [ ] 导航栏功能正常

### 记账功能
- [ ] 能添加新的交易记录
- [ ] 数据能保存到 Supabase
- [ ] 刷新页面数据不丢失
- [ ] 能编辑交易记录
- [ ] 能删除交易记录

### 图片功能
- [ ] 能上传图片
- [ ] 图片能正常显示
- [ ] 图片存储在 Supabase Storage

### AI 功能
- [ ] AI 分析功能正常
- [ ] 能获取省钱建议
- [ ] 图片识别功能正常（如果配置了 GLM）

### 统计功能
- [ ] 饼图正常显示
- [ ] 柱状图正常显示
- [ ] 数据统计准确

---

## 💰 费用说明

### AWS Amplify 免费套餐（12 个月）
- ✅ 1000 分钟构建/月
- ✅ 15GB 存储/月
- ✅ 15GB 流量/月

### 你的项目预估
- 构建：每次约 5 分钟，月 10 次 = 50 分钟
- 存储：约 50MB
- 流量：个人使用约 1-2GB/月

**结论**：完全在免费额度内 ✅

### 超出免费额度后
- 构建：$0.01/分钟
- 存储：$0.023/GB/月
- 流量：$0.15/GB

---

## 🔄 更新应用

### 方式 1：自动部署（推荐）
```bash
# 修改代码后
git add .
git commit -m "feat: 添加新功能"
git push origin main

# Amplify 会自动检测并部署
# 约 5 分钟后生效
```

### 方式 2：手动触发
1. 在 Amplify 控制台
2. 点击 **"Redeploy this version"**
3. 或点击 **"Run build"**

---

## 📞 获取帮助

### 官方文档
- AWS Amplify：https://docs.amplify.aws/
- Next.js on Amplify：https://docs.amplify.aws/guides/hosting/nextjs/

### 社区支持
- AWS Forums：https://forums.aws.amazon.com/
- GitHub Issues：https://github.com/Tigertonight/billLog_h5/issues

---

## 🎉 恭喜！

你的应用已经成功部署到 AWS Amplify！

**你现在拥有：**
- 🌍 全球 CDN 加速的网站
- 🔒 自动 HTTPS 证书
- 📊 Supabase 数据库
- 📸 云端图片存储
- 🤖 AI 智能分析
- 🚀 自动部署流程

**下一步：**
1. 分享你的应用 URL
2. 邀请朋友试用
3. 收集反馈并改进
4. 考虑添加自定义域名

---

**部署时间**：2025-10-23
**仓库地址**：https://github.com/Tigertonight/billLog_h5
**Supabase 项目**：https://lfibizlmcpgdgifkpgst.supabase.co

