# 🔍 环境变量验证指南

## 📋 验证步骤

### 1. 等待部署完成（3-5 分钟）

在 AWS Amplify 控制台查看部署进度：
- 状态应该从 "正在进行" → "成功"

---

### 2. 查看构建日志中的环境变量检查

在 Amplify 部署页面，点击 **"构建日志"**，找到这段输出：

```
=== Checking Environment Variables ===
DEEPSEEK_API_KEY length: 41
DEEPSEEK_API_KEY last 4 chars: 183e
GLM_API_KEY exists: YES
SUPABASE_URL exists: YES
======================================
```

**预期结果：**
- ✅ `DEEPSEEK_API_KEY length: 41` （应该是 41，不是 0 或其他数字）
- ✅ `DEEPSEEK_API_KEY last 4 chars: 183e` （应该是 `183e`，不是 `df64`）
- ✅ `GLM_API_KEY exists: YES`
- ✅ `SUPABASE_URL exists: YES`

**如果显示：**
- ❌ `DEEPSEEK_API_KEY length: 0` → 环境变量没有配置
- ❌ `DEEPSEEK_API_KEY last 4 chars: df64` → API key 被截断了

---

### 3. 访问测试端点

部署成功后，访问：
```
https://main.d331szc66in3kw.amplifyapp.com/api/test-env
```

**预期返回（JSON 格式）：**
```json
{
  "timestamp": "2025-10-26T08:00:00.000Z",
  "environment": "production",
  "environmentVariables": {
    "DEEPSEEK_API_KEY": {
      "exists": true,
      "length": 41,
      "first4": "sk-3",
      "last4": "183e",
      "expectedLength": 41,
      "isCorrectLength": true
    },
    "GLM_API_KEY": {
      "exists": true,
      "length": 32,
      "last4": "192f"
    },
    "NEXT_PUBLIC_SUPABASE_URL": {
      "exists": true,
      "value": "https://lfibizlmcpgdgifkpgst.supabase.co"
    },
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": {
      "exists": true,
      "length": 208,
      "last4": "QiRc"
    }
  },
  "allVariablesConfigured": true
}
```

**重点检查：**
- ✅ `DEEPSEEK_API_KEY.exists: true`
- ✅ `DEEPSEEK_API_KEY.length: 41`
- ✅ `DEEPSEEK_API_KEY.isCorrectLength: true`
- ✅ `DEEPSEEK_API_KEY.last4: "183e"`（不是 "df64"）
- ✅ `allVariablesConfigured: true`

---

### 4. 测试 AI 功能

1. 访问主页，添加几条消费记录
2. 点击 "AI 建议" 页面
3. 点击 "获取 AI 建议"
4. 应该能正常返回建议

---

### 5. 查看运行时日志（CloudWatch）

如果 AI 功能还是失败：

1. 在 Amplify 控制台，点击 **"监控"** → **"查看 CloudWatch 中的日志"**
2. 找到最新的日志流
3. 搜索：`DeepSeek API Environment Check`
4. 应该看到类似输出：

```
=== DeepSeek API Environment Check ===
Timestamp: 2025-10-26T08:00:00.000Z
DEEPSEEK_API_KEY exists: true
DEEPSEEK_API_KEY length: 41
DEEPSEEK_API_KEY first 4 chars: sk-3
DEEPSEEK_API_KEY last 4 chars: 183e
Expected length: 41, Actual length: 41
=====================================
```

---

## 🐛 常见问题和解决方案

### 问题 1：环境变量长度为 0
**原因：** 环境变量未配置或名称错误

**解决：**
1. 检查 Amplify 环境变量配置
2. 确认变量名是 `DEEPSEEK_API_KEY`（全大写，下划线）
3. 重新保存并部署

---

### 问题 2：API key 被截断（last 4 是 "df64"）
**原因：** 保存时值被截断

**解决：**
1. 点击编辑 `DEEPSEEK_API_KEY`
2. 删除现有值
3. 粘贴完整的：`sk-33078fa507a14793bbc0df642824183e`
4. 确认没有前后空格
5. 保存并重新部署

---

### 问题 3：构建日志中看不到环境变量信息
**原因：** 环境变量在构建时就没有被加载

**解决：**
1. 确认在 Amplify 控制台的 **"环境变量"** 页面已保存
2. 确认分支是 `main`（或你配置的分支）
3. 某些变量可能需要设置 "分支覆盖"

---

### 问题 4：/api/test-env 返回 404
**原因：** 代码还没部署完成

**解决：**
- 等待部署完成（约 3-5 分钟）
- 刷新页面

---

## 📊 验证成功的标志

所有以下条件都满足：
- ✅ 构建日志显示 `DEEPSEEK_API_KEY length: 41`
- ✅ `/api/test-env` 返回 `isCorrectLength: true`
- ✅ CloudWatch 日志显示 `DEEPSEEK_API_KEY exists: true`
- ✅ AI 建议功能正常工作

---

## 🎯 下一步

1. **等待部署完成**
2. **按照上述步骤逐项验证**
3. **把验证结果告诉我**：
   - 构建日志的截图
   - `/api/test-env` 的返回结果
   - AI 功能是否正常

我会根据结果进一步协助！🚀

