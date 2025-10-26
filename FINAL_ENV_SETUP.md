# 🔧 最终环境变量配置指南

## ⚠️ 重要提示

由于 AWS Amplify 的 SSM (Systems Manager) 权限问题，普通的环境变量可能无法正常加载。

**解决方案**：使用 `NEXT_PUBLIC_` 前缀的环境变量，它们会在构建时嵌入代码中。

---

## 📋 必需的环境变量配置

请在 AWS Amplify 控制台 → 你的应用 → 环境变量页面添加以下变量：

### 1. DeepSeek API Key（AI 建议功能）

**添加两个变量**（都要添加）：

| Variable name | Value |
|---------------|-------|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` |
| `NEXT_PUBLIC_DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` |

**注意**：
- ✅ 完整的 key 长度是 **41 个字符**
- ✅ 末尾应该是 `183e`
- ❌ 不要截断成 35 个字符

---

### 2. GLM API Key（票据识别功能）

**添加两个变量**（都要添加）：

| Variable name | Value |
|---------------|-------|
| `GLM_API_KEY` | `d8e097043799470db352e1192f...`（你的完整 GLM key） |
| `NEXT_PUBLIC_GLM_API_KEY` | `d8e097043799470db352e1192f...`（你的完整 GLM key） |

---

### 3. Supabase 配置（数据库和存储）

| Variable name | Value |
|---------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（完整的 anon key） |

---

## 📝 配置步骤

### 1. 进入环境变量页面
- AWS Amplify 控制台
- 选择你的应用 `billLog_h5`
- 左侧菜单 → **"环境变量"** 或 **"Environment variables"**

### 2. 添加/编辑变量
- 点击 **"管理变量"** 或 **"Manage variables"**
- 对于每个变量：
  1. Variable name：复制粘贴变量名（确保没有空格）
  2. Value：复制粘贴完整的值
  3. 分支：选择 **"所有分支"** 或 **"All branches"**

### 3. 保存
- 点击 **"保存"** 按钮

### 4. 重新部署
- 返回 **"部署"** 页面
- 点击 **"重新部署此版本"**

---

## ✅ 验证配置

部署完成后，查看构建日志，应该看到：

```
=== Checking Environment Variables ===
DEEPSEEK_API_KEY length: 41          ✅
NEXT_PUBLIC_DEEPSEEK_API_KEY length: 41  ✅
DEEPSEEK_API_KEY exists: YES         ✅
NEXT_PUBLIC_DEEPSEEK_API_KEY exists: YES  ✅
GLM_API_KEY exists: YES              ✅
SUPABASE_URL exists: YES             ✅
======================================
```

---

## 🎯 完整的环境变量列表

总共需要添加 **6 个环境变量**：

1. ✅ `DEEPSEEK_API_KEY` = `sk-33078fa507a14793bbc0df642824183e`
2. ✅ `NEXT_PUBLIC_DEEPSEEK_API_KEY` = `sk-33078fa507a14793bbc0df642824183e`
3. ✅ `GLM_API_KEY` = `d8e097043799470db352e1192f...`
4. ✅ `NEXT_PUBLIC_GLM_API_KEY` = `d8e097043799470db352e1192f...`
5. ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://lfibizlmcpgdgifkpgst.supabase.co`
6. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🐛 常见问题

### Q: 为什么要添加两个相同的 API key？
**A**: 
- 不带前缀的（如 `DEEPSEEK_API_KEY`）是标准的服务端环境变量
- 带 `NEXT_PUBLIC_` 前缀的是构建时嵌入的变量
- 由于 AWS Amplify 的 SSM 权限问题，我们使用 `NEXT_PUBLIC_` 作为备选方案

### Q: `NEXT_PUBLIC_` 变量会暴露 API key 吗？
**A**: 
- 虽然变量名有 `PUBLIC`，但这些 API 都是在服务端 API 路由中使用的
- 用户无法直接在浏览器中看到这些 key
- 相对安全

### Q: 如何获取 GLM API Key？
**A**:
1. 访问 https://open.bigmodel.cn/
2. 注册并登录
3. 创建 API key
4. 复制完整的 key

---

## 📊 配置后的功能

配置完成后，以下功能将正常工作：

- ✅ **AI 建议**：分析消费数据并给出省钱建议（流式输出）
- ✅ **票据识别**：上传票据图片自动识别金额、类别等信息
- ✅ **图片上传**：图片存储到 Supabase Storage
- ✅ **图片显示**：从 Supabase 加载并显示图片
- ✅ **数据存储**：交易记录存储到 Supabase PostgreSQL

---

## 🚀 下一步

1. **按照本文档配置所有 6 个环境变量**
2. **保存并重新部署**
3. **等待部署完成（3-5 分钟）**
4. **测试所有功能**：
   - 添加交易记录
   - 上传图片
   - 使用票据识别
   - 获取 AI 建议

**配置完成后告诉我测试结果！** 🎉

