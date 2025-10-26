# 🚀 快速修复指南

## 当前状态

✅ 代码已更新（安全的环境变量配置）
⏳ 需要配置 AWS IAM 权限
⏳ 需要重新部署

---

## 📋 操作清单（按顺序执行）

### 1️⃣ 配置 IAM 权限（5 分钟）

#### 方法一：使用托管策略（最简单）

1. 打开 **AWS Amplify 控制台**
2. 选择应用 `billLog_h5`
3. 左侧 → **"应用程序设置"** → **"通用设置"**
4. 找到 **"服务角色"**，点击角色名称
5. 在 IAM 页面，点击 **"添加权限"** → **"附加策略"**
6. 搜索：`AmazonSSMReadOnlyAccess`
7. 选中并点击 **"附加策略"**

#### 方法二：自定义策略（更安全）

参考 `SSM_PERMISSION_SETUP.md` 中的详细步骤。

---

### 2️⃣ 清理环境变量（3 分钟）

在 Amplify 控制台 → 环境变量页面：

**删除这些变量**（如果存在）：
- ❌ `NEXT_PUBLIC_DEEPSEEK_API_KEY`
- ❌ `NEXT_PUBLIC_GLM_API_KEY`

**保留这些变量**：
- ✅ `DEEPSEEK_API_KEY` = `sk-33078fa507a14793bbc0df642824183e`（完整 41 字符）
- ✅ `GLM_API_KEY` = `你的 GLM key`
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://lfibizlmcpgdgifkpgst.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `你的 Supabase anon key`

点击 **"保存"**

---

### 3️⃣ 重新部署（3-5 分钟）

1. 返回 Amplify **"部署"** 页面
2. 点击 **"重新部署此版本"**
3. 等待部署完成

---

### 4️⃣ 验证成功（1 分钟）

#### 查看构建日志

找到这段输出：

```
=== Checking Environment Variables (SSM) ===
DEEPSEEK_API_KEY length: 41
DEEPSEEK_API_KEY last 4 chars: 183e
DEEPSEEK_API_KEY: ✓ Loaded
GLM_API_KEY: ✓ Loaded
SUPABASE_URL: ✓ Loaded
============================================
```

**成功标志**：
- ✅ 所有变量都显示 `✓ Loaded`
- ✅ `DEEPSEEK_API_KEY length: 41`
- ✅ 不再出现 `!Failed to set up process.env.secrets`

---

#### 测试功能

1. **AI 建议**：
   - 访问 AI 建议页面
   - 点击 "获取 AI 建议"
   - 应该看到打字机效果的流式输出

2. **票据识别**：
   - 添加交易记录
   - 上传票据图片
   - 应该自动识别信息

3. **图片显示**：
   - 上传的图片应该正常显示
   - URL 应该是 Supabase Storage 地址

---

## ⚠️ 如果还是失败

### 检查 1：IAM 权限

确认服务角色有以下权限之一：
- `AmazonSSMReadOnlyAccess`（托管策略）
- 或自定义策略包含 `ssm:GetParameter*`

### 检查 2：环境变量

确认 `DEEPSEEK_API_KEY` 的值：
- 长度必须是 **41 个字符**
- 末尾应该是 `183e`
- 不是 35 个字符（被截断）

### 检查 3：重新部署

权限更改后**必须**重新部署才能生效。

---

## 🎯 预期结果

完成所有步骤后：

✅ **安全性**：API key 不会暴露到前端
✅ **AI 建议**：模拟流式输出，打字机效果
✅ **票据识别**：自动提取消费信息
✅ **图片显示**：从 Supabase 正常加载
✅ **数据存储**：保存到 Supabase 数据库

---

## 📚 相关文档

- 详细的 SSM 权限配置：`SSM_PERMISSION_SETUP.md`
- 流式输出技术方案：`STREAMING_SOLUTION.md`
- 完整环境变量配置：`FINAL_ENV_SETUP.md`

---

## 💬 需要帮助？

如果遇到问题，提供以下信息：

1. 构建日志中的 "Environment Variables" 部分
2. 是否已添加 IAM 权限
3. 环境变量配置截图
4. 具体的错误信息

**祝你部署成功！** 🎉

