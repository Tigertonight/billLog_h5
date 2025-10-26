# 🔧 npm 镜像源问题解决方案

## 问题描述

在 AWS Amplify 构建时，npm 尝试从错误的镜像源下载包：
```
npm error 504 Gateway Time-out - GET https://artifactory.devops.xiaohongshu.com/...
```

这是因为系统级别配置了小红书内部的 npm 镜像。

---

## 解决方案

### 方案 1：使用官方 npm 源（已应用）

**文件**：`amplify.yml`

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm config set registry https://registry.npmjs.org/
        - npm config set strict-ssl false
        - npm ci --registry=https://registry.npmjs.org/
    build:
      commands:
        - npm run build
```

**优点**：
- ✅ 使用官方源，最权威
- ✅ 全球 CDN，速度可以

**缺点**：
- ⚠️ 国内访问可能较慢
- ⚠️ 可能被墙

---

### 方案 2：使用淘宝镜像（备用）

**文件**：`amplify-taobao.yml`

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm config set registry https://registry.npmmirror.com/
        - npm config set strict-ssl false
        - npm ci --registry=https://registry.npmmirror.com/
    build:
      commands:
        - npm run build
```

**优点**：
- ✅ 国内访问快
- ✅ 稳定可靠
- ✅ 同步官方源

**缺点**：
- ⚠️ 可能有几分钟延迟

**如何切换**：
1. 在 Amplify 控制台
2. Build settings → Edit
3. 复制 `amplify-taobao.yml` 的内容
4. 替换当前配置
5. 保存并重新部署

---

### 方案 3：使用 pnpm（未实施）

如果 npm 持续有问题，可以切换到 pnpm：

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm config set registry https://registry.npmjs.org/
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm run build
```

---

## 验证方法

### 本地验证
```bash
# 清理缓存
rm -rf node_modules package-lock.json

# 设置源
npm config set registry https://registry.npmjs.org/

# 安装
npm install

# 构建
npm run build
```

### Amplify 验证
查看构建日志，应该看到：
```
✓ npm config set registry https://registry.npmjs.org/
✓ npm ci --registry=https://registry.npmjs.org/
  added 290 packages in 45s
✓ npm run build
```

---

## 其他可能的镜像源

如果以上都不行，可以尝试：

### 1. 华为云镜像
```
https://mirrors.huaweicloud.com/repository/npm/
```

### 2. 腾讯云镜像
```
https://mirrors.cloud.tencent.com/npm/
```

### 3. 阿里云镜像
```
https://registry.npmmirror.com/
```

### 4. 中科大镜像
```
https://npmreg.proxy.ustclug.org/
```

---

## 常见问题

### Q: 为什么 .npmrc 文件不起作用？
A: 因为系统级别的 npm 配置（~/.npmrc）优先级更高，会覆盖项目的 .npmrc。

### Q: 如何查看当前使用的源？
A: 在构建日志中添加命令：
```yaml
- npm config get registry
```

### Q: 如何清除 npm 缓存？
A: 在 preBuild 中添加：
```yaml
- npm cache clean --force
```

### Q: 如何加速构建？
A: 
1. 使用国内镜像
2. 启用缓存（已配置）
3. 使用 pnpm 或 yarn

---

## 推荐配置

**对于国内用户**：
- 推荐使用淘宝镜像（`amplify-taobao.yml`）
- 速度快，稳定性好

**对于海外用户**：
- 使用官方源（`amplify.yml`）
- 速度快，最新

**对于企业用户**：
- 使用企业内部镜像
- 需要配置 VPN 或代理

---

**最后更新**：2025-10-26
**当前方案**：使用官方 npm 源（强制配置）
**备用方案**：淘宝镜像（已准备好）

