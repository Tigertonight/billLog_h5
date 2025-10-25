# API 密钥配置指南

## 问题说明

如果您看到 "获取AI建议失败，请检查网络连接或稍后再试" 的错误，这是因为缺少 API 密钥配置。

从终端日志中可以看到错误信息：
```
DeepSeek API error: {"error":{"message":"Authentication Fails, Your api key: ****here is invalid",...}}
```

## 需要配置的 API 密钥

项目使用了两个 AI 服务：

### 1. DeepSeek API（必需 - 用于 AI 建议功能）

**用途**：
- 消费模式分析
- 省钱建议生成
- 个性化理财建议

**获取步骤**：
1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册账号并登录
3. 进入 API Keys 页面
4. 点击「创建新密钥」
5. 复制生成的 API 密钥

**费用**：
- 新用户通常有免费额度
- 按 token 使用量计费，价格实惠

### 2. 智谱 GLM API（已配置 - 用于图片识别）

**用途**：
- 票据图片识别（OCR）
- 自动提取金额、类别、日期等信息

从日志可以看到 GLM API 已经工作正常：
```
Full GLM API response: {
  "choices": [{"message": {"content": "..."}}],
  "model": "glm-4v",
  ...
}
POST /api/ai/parse-receipt 200 in 8496ms
```

**如果需要更换密钥**：
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并登录
3. 进入 API Keys 页面
4. 创建新的 API 密钥

## 配置步骤

### 步骤 1：编辑环境配置文件

项目根目录下已经创建了 `.env.local` 文件，请编辑它：

```bash
# 使用任意文本编辑器打开
nano .env.local
# 或
code .env.local
# 或
open -e .env.local
```

### 步骤 2：填入 API 密钥

将文件内容修改为：

```env
# DeepSeek API 密钥 - 用于 AI 消费分析和省钱建议
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 智谱 GLM API 密钥 - 用于图片识别（票据OCR）
GLM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
```

**重要**：
- 将 `your_deepseek_api_key_here` 替换为你的实际 DeepSeek API 密钥
- 如果 GLM API 需要更换，也替换 `your_glm_api_key_here`
- 不要添加引号，直接粘贴密钥即可

### 步骤 3：重启开发服务器

配置完成后，需要重启服务器才能生效：

```bash
# 1. 停止当前运行的服务器（Ctrl + C）
# 或使用命令
pkill -f "next dev"

# 2. 重新启动
./start-dev.sh
```

### 步骤 4：验证配置

1. 打开浏览器访问 http://localhost:3000
2. 点击「统计」页面
3. 点击「获取 AI 建议」按钮
4. 如果配置正确，应该能看到 AI 生成的建议

## 常见问题

### Q1: DeepSeek API 密钥格式是什么样的？

A: 通常以 `sk-` 开头，后面跟一串字母和数字，例如：
```
sk-1234567890abcdefghijklmnopqrstuvwxyz
```

### Q2: 配置后仍然报错？

A: 请检查：
1. 密钥是否正确复制（没有多余空格或换行）
2. 密钥是否已激活（某些平台需要激活）
3. 账户是否有足够的余额或额度
4. 是否重启了开发服务器

### Q3: 不想使用 DeepSeek，可以换成其他 AI 吗？

A: 可以！项目代码支持修改。主要需要修改：
- `app/api/ai/analyze/route.ts` - API 端点
- `lib/deepseek.ts` - API 调用逻辑

如需帮助，请参考这些文件中的注释。

### Q4: 如何查看 API 使用情况？

A: 
- **DeepSeek**: 登录 [platform.deepseek.com](https://platform.deepseek.com/)，查看「使用统计」
- **智谱 GLM**: 登录 [open.bigmodel.cn](https://open.bigmodel.cn/)，查看「控制台」

### Q5: 图片识别功能正常，但 AI 建议失败？

A: 这说明 GLM API 已配置，但缺少 DeepSeek API 密钥。只需配置 DeepSeek 即可。

## 安全注意事项

⚠️ **重要**：
1. **.env.local 文件已在 .gitignore 中**，不会被提交到 Git
2. **不要将 API 密钥分享给他人**
3. **不要在公开的代码中包含密钥**
4. **定期轮换密钥以保证安全**

如果不小心泄露了密钥：
1. 立即登录平台删除该密钥
2. 生成新的密钥并更新配置

## 功能对应关系

| 功能 | 使用的 API | 是否必需 |
|------|-----------|----------|
| 快速记账 | 无 | - |
| 图片识别记账 | GLM API | 可选 |
| 统计图表 | 无 | - |
| AI 消费分析 | DeepSeek API | 可选 |
| AI 省钱建议 | DeepSeek API | 可选 |
| 个性化理财建议 | DeepSeek API | 可选 |
| 预算管理 | 无 | - |
| 时间线查看 | 无 | - |

**注意**：即使不配置 API 密钥，基础记账功能仍可正常使用。API 仅用于增强功能。

## 获取帮助

如果配置过程中遇到问题：
1. 查看终端输出的错误信息
2. 检查 API 平台的文档
3. 确认网络连接正常
4. 查看项目的 SETUP.md 文件

---

**配置完成后，记得重启开发服务器！** 🚀


