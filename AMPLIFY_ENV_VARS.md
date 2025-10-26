# 🔧 AWS Amplify 环境变量配置

## 必需的环境变量

在 AWS Amplify 控制台添加以下环境变量：

### 1. DeepSeek API Key
```
Variable name: DEEPSEEK_API_KEY
Value: sk-33078fa507a14793bbc0df642824183e
```

### 2. GLM API Key（可选）
```
Variable name: GLM_API_KEY
Value: your_glm_api_key_here
```

### 3. Supabase URL
```
Variable name: NEXT_PUBLIC_SUPABASE_URL
Value: https://lfibizlmcpgdgifkpgst.supabase.co
```

### 4. Supabase Anon Key
```
Variable name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaWJpemxtY3BnZGdpZmtwZ3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDM0NDksImV4cCI6MjA3NjkxOTQ0OX0.ar4Vq7bpe0ctJ2BZ_Fv_C7AxbsNA1Ec5nqK9uw7QiRc
```

---

## 配置步骤

1. 登录 AWS Amplify 控制台
2. 选择你的应用 `billLog_h5`
3. 点击左侧 **"Environment variables"**
4. 点击 **"Add variable"**
5. 输入 Variable name 和 Value
6. 重复添加所有 4 个变量
7. 点击 **"Save"**
8. 返回部署页面
9. 点击 **"Redeploy this version"**

---

## 验证

添加环境变量后重新部署，应该能看到：
```
✓ npm ci completed
✓ npm run build completed
✓ Deployment completed
```

---

## 注意事项

- 变量名必须**完全一致**（区分大小写）
- `NEXT_PUBLIC_` 开头的变量会暴露到客户端
- 不要添加引号，直接粘贴值即可
- 修改环境变量后需要重新部署才能生效

