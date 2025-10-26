# 🔐 AWS Amplify SSM 权限配置指南

## 问题背景

AWS Amplify 使用 **AWS Systems Manager (SSM) Parameter Store** 来管理环境变量。如果服务角色没有正确的权限，环境变量将无法加载，导致：

```
!Failed to set up process.env.secrets
DEEPSEEK_API_KEY: ✗ Missing
GLM_API_KEY: ✗ Missing
```

---

## ✅ 解决方案：配置 SSM 读取权限

### 步骤 1：进入 IAM 控制台

1. **打开 AWS Amplify 控制台**
   - 选择你的应用：`billLog_h5`
   - 左侧菜单 → **"应用程序设置"** → **"通用设置"**

2. **找到服务角色**
   - 在 "服务角色" 部分，点击角色名称
   - 类似：`amplify-billLog_h5-main-xxxxx`
   - 会自动跳转到 IAM 控制台

---

### 步骤 2：添加 SSM 权限

#### 方案 A：使用 AWS 托管策略（最简单）

1. 在 IAM 角色页面，点击 **"添加权限"** → **"附加策略"**

2. 搜索并选择：
   ```
   AmazonSSMReadOnlyAccess
   ```

3. 点击 **"附加策略"**

**优点**：
- ✅ 一键配置
- ✅ AWS 官方维护
- ✅ 包含所有必要权限

**缺点**：
- ⚠️ 权限范围较大（可以读取所有 SSM 参数）

---

#### 方案 B：自定义最小权限策略（最安全，推荐）

1. 在 IAM 控制台，点击左侧 **"策略"** → **"创建策略"**

2. 选择 **JSON** 编辑器，粘贴以下内容：

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AmplifySSMParameterAccess",
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:GetParametersByPath"
            ],
            "Resource": [
                "arn:aws:ssm:*:*:parameter/amplify/d331szc66in3kw/*"
            ]
        }
    ]
}
```

3. 点击 **"下一步"**

4. 策略名称：`AmplifySSMParameterAccess`

5. 描述：`Allow Amplify to read environment variables from SSM Parameter Store`

6. 点击 **"创建策略"**

7. 返回角色页面，点击 **"添加权限"** → **"附加策略"**

8. 搜索 `AmplifySSMParameterAccess`，选择并附加

**优点**：
- ✅ 最小权限原则
- ✅ 只能读取 Amplify 相关参数
- ✅ 安全性最高

---

### 步骤 3：验证权限

1. **查看角色的权限策略**
   - 应该包含以下权限：
     ```
     ssm:GetParameter
     ssm:GetParameters
     ssm:GetParametersByPath
     ```

2. **查看资源限制**（如果使用方案 B）
   - 应该限制在 `/amplify/d331szc66in3kw/*` 路径

---

### 步骤 4：重新部署

权限配置完成后：

1. 返回 **Amplify 控制台**

2. 点击 **"部署"** 页面

3. 点击 **"重新部署此版本"**

4. 等待部署完成（3-5 分钟）

---

## 📋 验证配置成功

部署完成后，查看构建日志，应该看到：

```
=== Checking Environment Variables (SSM) ===
DEEPSEEK_API_KEY length: 41
DEEPSEEK_API_KEY last 4 chars: 183e
DEEPSEEK_API_KEY: ✓ Loaded
GLM_API_KEY: ✓ Loaded
SUPABASE_URL: ✓ Loaded
============================================
```

**不再出现**：
```
!Failed to set up process.env.secrets
```

---

## 🔍 权限策略详解

### Resource ARN 格式

```
arn:aws:ssm:{region}:{account-id}:parameter/{path}
```

**示例**：
```
arn:aws:ssm:*:*:parameter/amplify/d331szc66in3kw/*
```

**说明**：
- `*`（第一个）：所有区域
- `*`（第二个）：当前账户
- `/amplify/d331szc66in3kw/*`：只允许访问你的 Amplify 应用参数

### 必需的 Actions

| Action | 说明 |
|--------|------|
| `ssm:GetParameter` | 读取单个参数 |
| `ssm:GetParameters` | 批量读取参数 |
| `ssm:GetParametersByPath` | 按路径读取所有参数 |

---

## ⚠️ 常见问题

### Q1: 添加权限后还是失败？

**A**: 需要重新部署！权限更改不会自动应用到正在运行的环境。

---

### Q2: 不知道应用的路径是什么？

**A**: 在构建日志中查找：
```
SSM params {"Path":"/amplify/d331szc66in3kw/main/","WithDecryption":true}
```

路径就是 `/amplify/d331szc66in3kw/main/`

---

### Q3: 使用方案 A 还是方案 B？

**推荐**：
- **个人项目**：方案 A（简单快速）
- **生产项目**：方案 B（安全合规）

---

## 🎯 环境变量配置

确保在 Amplify 控制台已添加：

| Variable name | Value | 说明 |
|---------------|-------|------|
| `DEEPSEEK_API_KEY` | `sk-33078fa507a14793bbc0df642824183e` | AI 建议功能 |
| `GLM_API_KEY` | `你的 GLM key` | 票据识别功能 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lfibizlmcpgdgifkpgst.supabase.co` | 数据库 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `你的 anon key` | 数据库密钥 |

**注意**：
- ✅ `NEXT_PUBLIC_SUPABASE_*` 可以暴露（只读权限）
- ❌ 不要添加 `NEXT_PUBLIC_DEEPSEEK_API_KEY`（不安全）
- ❌ 不要添加 `NEXT_PUBLIC_GLM_API_KEY`（不安全）

---

## 📊 完整的配置检查清单

- [ ] 1. 确认 Amplify 服务角色已配置
- [ ] 2. 添加了 SSM 读取权限（方案 A 或 B）
- [ ] 3. 在 Amplify 环境变量页面添加了 4 个变量
- [ ] 4. 删除了所有 `NEXT_PUBLIC_DEEPSEEK_API_KEY` 和 `NEXT_PUBLIC_GLM_API_KEY`
- [ ] 5. 重新部署应用
- [ ] 6. 查看构建日志验证环境变量加载成功
- [ ] 7. 测试 AI 建议功能
- [ ] 8. 测试票据识别功能

---

## 🚀 完成后的效果

- ✅ 环境变量安全地存储在 SSM 中
- ✅ API Key 不会暴露到前端代码
- ✅ 所有 API 路由可以正常访问环境变量
- ✅ AI 建议功能正常工作
- ✅ 票据识别功能正常工作

**配置完成后重新部署，所有功能将完美运行！** 🎉

