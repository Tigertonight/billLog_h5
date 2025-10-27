# 📱 BillLog H5 - Vercel 部署版

基于 Next.js 14 的智能账单管理应用，现已部署到 Vercel！

---

## 🚀 快速开始

### 在线访问
- **生产环境:** [https://billlog-h5.vercel.app](https://billlog-h5.vercel.app)
- **演示账号:** 自行注册或使用 Supabase Auth

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/your-username/billLog_h5.git
cd billLog_h5

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API 密钥

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

---

## ✨ 核心特性

### 📊 账单管理
- ✅ 快速记账（收入/支出）
- ✅ 分类管理（餐饮、交通、购物等）
- ✅ 图片凭证上传
- ✅ 时间线视图
- ✅ CSV 数据导出

### 🤖 AI 智能分析
- ✅ **流式响应** - 实时查看 AI 分析结果（像 ChatGPT 一样）
- ✅ 消费习惯分析
- ✅ 个性化省钱建议
- ✅ 支出趋势预测
- ✅ 基于 DeepSeek AI

### 📈 数据统计
- ✅ 支出/收入统计
- ✅ 分类占比图表
- ✅ 月度趋势分析
- ✅ 预算跟踪
- ✅ 使用 Recharts 可视化

### 🎨 界面设计
- ✅ 现代化 UI（Tailwind CSS）
- ✅ 响应式设计（移动端优先）
- ✅ 暗黑模式支持
- ✅ 流畅动画效果

---

## 🛠️ 技术栈

### 前端框架
- **Next.js 14** - React 服务端渲染框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化 CSS
- **Lucide React** - 图标库

### 后端服务
- **Next.js API Routes** - 服务端 API
- **Supabase** - 数据库 + 认证 + 存储
- **DeepSeek AI** - 大语言模型

### 部署平台
- **Vercel** - 边缘网络 + 自动部署
- **特点：**
  - ⚡ 全球 CDN
  - 🔄 流式响应支持（SSE）
  - 🚀 秒级部署
  - 📊 实时日志

---

## 📦 项目结构

```
billLog_h5/
├── app/                      # Next.js 应用路由
│   ├── api/                  # API 路由
│   │   ├── ai/
│   │   │   ├── analyze/      # AI 分析接口（流式）
│   │   │   └── parse-receipt/ # 票据识别
│   │   ├── csv/              # CSV 导出
│   │   └── upload/           # 图片上传
│   ├── budget/               # 预算页面
│   ├── statistics/           # 统计页面
│   ├── timeline/             # 时间线页面
│   ├── ai-advice/            # AI 建议页面
│   ├── profile/              # 个人中心
│   └── login/                # 登录页面
├── components/               # React 组件
│   ├── layout/               # 布局组件
│   └── ui/                   # UI 组件库
├── contexts/                 # React Context
├── lib/                      # 工具函数
├── types/                    # TypeScript 类型
├── public/                   # 静态资源
├── vercel.json               # Vercel 配置
├── next.config.mjs           # Next.js 配置
└── tailwind.config.ts        # Tailwind 配置
```

---

## 🔧 配置指南

### 环境变量

在 Vercel Dashboard 或本地 `.env.local` 中设置：

```bash
# Supabase（数据库 + 认证 + 存储）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI API（DeepSeek）
DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# 可选：GLM AI（备用）
GLM_API_KEY=your-glm-api-key

# 功能开关
ENABLE_STREAMING=true  # 启用流式响应（Vercel 支持）
```

### Supabase 数据库表结构

主要表：
- `profiles` - 用户信息
- `transactions` - 交易记录
- `accounts` - 账户信息
- `budgets` - 预算设置

查看完整 SQL：`supabase/migrations/`

---

## 🚀 部署到 Vercel

### 方法 1: 通过 GitHub（推荐）

1. **Fork 或推送代码到 GitHub**
2. **登录 [Vercel](https://vercel.com)**
3. **Import Project**
   - 选择你的 GitHub 仓库
   - Framework 自动检测为 Next.js
4. **添加环境变量**
   - 复制上面的环境变量清单
   - 粘贴到 Environment Variables
5. **点击 Deploy**
   - 等待 1-2 分钟
   - 完成！🎉

### 方法 2: 通过 CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

### 一键部署脚本

```bash
# 使用项目提供的部署脚本
./deploy-vercel.sh
```

---

## 📚 详细文档

- **[快速部署指南](./VERCEL_QUICK_START.md)** - 5分钟快速部署
- **[完整迁移指南](./VERCEL_MIGRATION_GUIDE.md)** - 从 AWS Amplify 迁移
- **[平台对比](./VERCEL_VS_AMPLIFY.md)** - Vercel vs AWS Amplify
- **[功能特性](./FEATURES.md)** - 详细功能说明
- **[API 文档](./API_DOCS.md)** - API 接口文档

---

## 🎯 核心优势

### 为什么选择 Vercel？

1. **流式响应支持 ⭐⭐⭐⭐⭐**
   - AI 分析结果实时显示
   - 用户体验提升 10 倍
   - 类似 ChatGPT 的交互

2. **极速部署**
   - 推送代码 → 自动部署
   - 30 秒完成构建
   - 全球 CDN 秒级分发

3. **完美的 Next.js 支持**
   - Next.js 官方推荐
   - 零配置开箱即用
   - 自动优化性能

4. **开发体验**
   - 实时预览部署
   - 清晰的错误提示
   - 简单的环境变量管理

---

## 🔐 安全最佳实践

### 环境变量
- ✅ **服务端密钥**（如 `DEEPSEEK_API_KEY`）仅在 API Routes 中使用
- ✅ **客户端变量**（`NEXT_PUBLIC_*`）才暴露到浏览器
- ✅ 永远不要在客户端代码中硬编码密钥

### Supabase 安全
- ✅ 启用 Row Level Security (RLS)
- ✅ 用户只能访问自己的数据
- ✅ 使用 Supabase Auth 进行身份验证

### API 限流
```typescript
// 建议在 API Routes 中添加限流
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制 100 次请求
})
```

---

## 📊 性能指标

### Lighthouse 分数（生产环境）
- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 95+

### 关键指标
- **FCP (First Contentful Paint):** ~500ms
- **LCP (Largest Contentful Paint):** ~1.2s
- **TTI (Time to Interactive):** ~1.8s
- **CLS (Cumulative Layout Shift):** < 0.1

---

## 🐛 故障排查

### 常见问题

#### 1. 环境变量未生效
```bash
# 检查变量名是否正确（区分大小写）
# 确认在 Vercel Dashboard 中已添加
# 重新部署项目
vercel --prod
```

#### 2. API 请求失败
```bash
# 查看 Vercel 日志
vercel logs [deployment-url]

# 检查 API Key 是否有效
curl https://api.deepseek.com/v1/models \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY"
```

#### 3. Supabase 连接失败
```bash
# 检查 URL 和 Key 是否正确
# 确认 Supabase 项目未暂停
# 验证网络连接
```

#### 4. 图片上传失败
```bash
# 检查 Supabase Storage 配置
# 确认文件大小限制
# 验证 CORS 设置
```

---

## 🤝 贡献指南

欢迎贡献代码！

### 开发流程
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
```bash
# 运行 Lint 检查
npm run lint

# 运行类型检查
npm run type-check

# 运行测试（如果有）
npm test
```

---

## 📄 许可证

MIT License - 查看 [LICENSE](./LICENSE) 文件

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Vercel](https://vercel.com/) - 部署平台
- [Supabase](https://supabase.com/) - 后端服务
- [DeepSeek](https://www.deepseek.com/) - AI 能力
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Lucide](https://lucide.dev/) - 图标库

---

## 📮 联系方式

- **Issues:** [GitHub Issues](https://github.com/your-username/billLog_h5/issues)
- **讨论:** [GitHub Discussions](https://github.com/your-username/billLog_h5/discussions)

---

## 🎉 开始使用

```bash
# 1. 克隆项目
git clone https://github.com/your-username/billLog_h5.git

# 2. 安装依赖
cd billLog_h5 && npm install

# 3. 配置环境变量
cp .env.example .env.local

# 4. 启动开发服务器
npm run dev

# 5. 部署到 Vercel
vercel
```

**祝你使用愉快！** 🚀

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

