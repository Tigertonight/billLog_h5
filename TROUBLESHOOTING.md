# 🔧 部署故障排查指南

## 常见构建错误及解决方案

### ❌ 错误 1：npm 下载超时

**错误信息**：
```
npm error 504 Gateway Time-out
npm error code E504
```

**原因**：
- npm 使用了错误的镜像源
- 网络连接问题
- npm 源被墙

**解决方案**：
✅ 已修复！项目中已添加 `.npmrc` 文件使用官方源

如果仍然失败，可以尝试：
1. 使用淘宝镜像（国内更快）
2. 修改 `.npmrc` 为：
   ```
   registry=https://registry.npmmirror.com/
   ```

---

### ❌ 错误 2：环境变量未配置

**错误信息**：
```
Supabase URL or Anon Key is missing
```

**原因**：
环境变量未在 Amplify 中配置

**解决方案**：
1. 进入 Amplify 控制台
2. 点击 "Environment variables"
3. 确认以下变量都已添加：
   - `DEEPSEEK_API_KEY`
   - `GLM_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 重新部署

---

### ❌ 错误 3：构建内存不足

**错误信息**：
```
JavaScript heap out of memory
```

**原因**：
Next.js 构建需要较多内存

**解决方案**：
1. 在 Amplify 控制台
2. Build settings → Edit
3. 添加环境变量：
   ```
   NODE_OPTIONS=--max-old-space-size=4096
   ```

---

### ❌ 错误 4：TypeScript 类型错误

**错误信息**：
```
Type error: ...
```

**原因**：
代码中有类型错误

**解决方案**：
1. 在本地运行 `npm run build`
2. 修复所有类型错误
3. 提交并推送

---

### ❌ 错误 5：Supabase 连接失败

**错误信息**：
```
Failed to fetch from Supabase
```

**原因**：
- Supabase URL 或 Key 错误
- Supabase 项目未启动
- 网络问题

**解决方案**：
1. 检查 Supabase 项目状态
2. 确认 URL 和 Key 正确
3. 测试 Supabase 连接：
   ```bash
   curl https://你的项目.supabase.co
   ```

---

## 🔍 调试技巧

### 1. 查看完整构建日志
1. 在 Amplify 控制台
2. 点击失败的部署
3. 展开每个阶段查看详细日志
4. 搜索 "error" 或 "failed"

### 2. 本地测试构建
```bash
# 清理缓存
rm -rf .next node_modules

# 重新安装
npm install

# 测试构建
npm run build

# 测试运行
npm start
```

### 3. 检查环境变量
在 Amplify 控制台：
```
App settings → Environment variables
```
确认所有变量都已添加且值正确

### 4. 查看 Amplify 服务状态
访问：https://status.aws.amazon.com/
检查 Amplify 服务是否正常

---

## 📝 提交问题时需要提供的信息

如果需要帮助，请提供：

1. **完整的构建日志**
   - 从 Amplify 控制台复制
   - 包含所有阶段的日志

2. **环境变量配置**
   - 列出所有已配置的变量名（不要包含值）

3. **错误截图**
   - 构建失败的截图
   - 错误信息的截图

4. **本地测试结果**
   - `npm run build` 的输出
   - 是否能在本地成功构建

---

## ✅ 成功部署的标志

当你看到以下内容时，说明部署成功：

```
✓ Provision completed
✓ Build completed
✓ Deploy completed
✓ Verify completed

Deployment successfully completed
```

访问你的 URL 应该能看到应用首页。

---

## 🆘 仍然无法解决？

1. **查看官方文档**
   - [Amplify Hosting 文档](https://docs.aws.amazon.com/amplify/latest/userguide/)
   - [Next.js on Amplify](https://docs.amplify.aws/guides/hosting/nextjs/)

2. **检查 GitHub Issues**
   - 搜索类似的问题
   - 查看是否有解决方案

3. **联系支持**
   - AWS Support（如果有支持计划）
   - AWS Forums
   - Stack Overflow

---

**最后更新**：2025-10-25
**常见问题已修复**：npm 镜像源问题

