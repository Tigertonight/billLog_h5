# 理想生活记账本

## 项目概述
这是一款基于Next.js开发的记账H5应用，采用shadcn风格UI，设计简洁友好现代化，参考苹果系统设计。核心功能包括快速记账、数据可视化统计、AI省钱建议、预算管理、多账号数据隔离等。通过集成DeepSeek API和智谱GLM API，为用户提供智能化的消费分析和图片识别功能。

> ⚠️ **重要提示**：如果遇到 "获取AI建议失败" 的错误，请查看 [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) 配置 API 密钥。

## 目标用户
- 需要便捷记账功能的个人用户
- 希望通过AI获得消费分析和省钱建议的用户
- 需要管理多个账号(如家庭成员、多账本)的用户
- 重视数据隐私、使用本地存储的用户

## 技术选型
- **开发框架**: Next.js 14 (App Router)
- **UI组件库**: Shadcn UI + Tailwind CSS
- **图表可视化**: Recharts
- **状态管理**: React Context API
- **数据存储**: 本地CSV文件 + LocalStorage
- **AI集成**: DeepSeek API
- **类型检查**: TypeScript
- **包管理器**: npm
- **UI风格**: 现代简约风格，支持明暗模式，参考苹果设计

## 应用结构
```
billLog_h5/
├── app/                      # Next.js App Router页面
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页(快速记账)
│   ├── statistics/          # 统计分析页
│   ├── timeline/            # 时间线记录页
│   ├── budget/              # 预算管理页
│   ├── profile/             # 我的页面
│   ├── api/                 # API路由
│   │   ├── csv/            # CSV操作API
│   │   └── ai/             # AI分析API
│   └── globals.css         # 全局样式
├── components/              # 可重用组件
│   ├── ui/                 # Shadcn UI组件
│   ├── layout/             # 布局组件
│   └── charts/             # 图表组件
├── lib/                     # 工具函数
│   ├── csv.ts              # CSV处理
│   ├── deepseek.ts         # DeepSeek API集成
│   └── utils.ts            # 通用工具函数
├── contexts/                # React Context
│   ├── AccountContext.tsx  # 账号管理
│   └── ThemeContext.tsx    # 主题管理
├── types/                   # TypeScript类型定义
│   └── index.ts
├── public/                  # 静态资源
│   └── csv/                # CSV数据文件
└── hooks/                   # 自定义Hooks
```

## 页面结构

| 页面名称 | 路由 | 核心功能 | 技术实现 |
|:--------|:-----|:---------|:---------|
| 快速记账页 | / | 记账表单、账号切换、主题切换 | App Router、Shadcn Form组件、Context API |
| 统计分析页 | /statistics | 分类饼图、趋势柱状图、AI省钱建议 | Recharts、DeepSeek API |
| 时间线记录页 | /timeline | 记录列表、编辑、删除功能 | 列表渲染、Dialog组件、CSV更新 |
| 预算管理页 | /budget | 预算设置、进度展示、超支提醒 | Progress组件、实时计算、LocalStorage |
| 我的页面 | /profile | 经济画像设置、AI定制化建议 | Form表单、DeepSeek API、LocalStorage |

## 数据模型

### CSV文件结构 (每个账号一个CSV文件)
```csv
id,date,category,amount,note
1,2025-10-23,餐饮,50,午餐
2,2025-10-23,购物,200,衣服
```

### TypeScript接口
```typescript
interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note?: string
}

interface Budget {
  category: string
  amount: number
  spent: number
}

interface EconomicProfile {
  monthlyIncome: number
  mainCategories: string[]
  savingsGoal: number
  note?: string
}
```

## 技术实现细节

### 1. 主题切换实现
- 使用 React Context API 管理主题状态
- 通过 `localStorage` 持久化用户的主题选择
- 支持系统偏好检测（prefers-color-scheme）
- 使用 Tailwind 的 `dark:` 变体实现暗色模式样式

### 2. 多账号数据隔离
- 每个账号对应独立的 CSV 文件（user1.csv, user2.csv, user3.csv）
- 预算和经济画像数据按账号分别存储在 localStorage
- 切换账号时自动加载对应账号的所有数据
- Context API 统一管理当前账号状态

### 3. CSV 数据处理
- 使用 PapaParse 库进行 CSV 解析和生成
- Next.js API Routes 处理服务端文件读写
- 支持完整的 CRUD 操作（创建、读取、更新、删除）
- 首次访问自动创建示例数据

### 4. DeepSeek AI 集成
- 通过 Next.js API Routes 代理 AI 请求，保护 API 密钥
- 消费分析：统计分类占比和趋势，生成省钱建议
- 定制化建议：结合用户画像和消费数据，提供个性化理财方案
- 错误处理：网络失败时显示友好提示

### 5. 图表可视化
- 使用 Recharts 实现响应式图表
- 饼图：展示各分类消费占比
- 柱状图：显示消费趋势（最近10天）
- 自定义 Tooltip 显示详细信息

### 6. 预算管理算法
- 实时计算当前月份各分类的已消费金额
- 动态计算预算使用百分比
- 根据使用情况显示不同颜色的进度条：
  - 绿色：正常（< 80%）
  - 黄色：接近预算（80% - 100%）
  - 红色：超支（> 100%）

### 7. 响应式设计
- 移动优先的设计理念
- 使用 Tailwind CSS 的响应式断点
- 底部导航栏固定在移动端
- 图表自动适配不同屏幕尺寸

### 8. 用户体验优化
- 加载状态展示（Spinner 动画）
- 操作反馈（成功/失败提示）
- 空状态友好提示
- 表单验证和错误提示
- 对话框确认删除操作

## 开发状态跟踪

| 模块 | 状态 | 文件路径 |
|:----|:-----|:---------|
| 项目初始化 | ✅ 已完成 | package.json, tsconfig.json, tailwind.config.ts |
| 主题Provider | ✅ 已完成 | contexts/ThemeContext.tsx |
| 账号Context | ✅ 已完成 | contexts/AccountContext.tsx |
| CSV工具函数 | ✅ 已完成 | lib/csv.ts |
| DeepSeek集成 | ✅ 已完成 | lib/deepseek.ts |
| 底部导航栏 | ✅ 已完成 | components/layout/Navbar.tsx |
| 页面头部 | ✅ 已完成 | components/layout/Header.tsx |
| UI组件 | ✅ 已完成 | components/ui/* |
| 快速记账页 | ✅ 已完成 | app/page.tsx |
| 统计分析页 | ✅ 已完成 | app/statistics/page.tsx |
| 时间线记录页 | ✅ 已完成 | app/timeline/page.tsx |
| 预算管理页 | ✅ 已完成 | app/budget/page.tsx |
| 我的页面 | ✅ 已完成 | app/profile/page.tsx |
| CSV API | ✅ 已完成 | app/api/csv/[userId]/route.ts |
| AI API | ✅ 已完成 | app/api/ai/analyze/route.ts |

**🎉 所有核心功能已开发完成！**

## 环境变量配置
```env
DEEPSEEK_API_KEY=你的DeepSeek API密钥
```

## 运行说明
1. 安装依赖: `npm install`
2. 配置环境变量: 创建`.env.local`文件，添加`DEEPSEEK_API_KEY`
3. 启动开发服务器: `npm run dev`
4. 访问应用: `http://localhost:3000`

## 特色功能
- ✅ 多账号数据隔离 (user1/user2/user3)
- ✅ 明暗模式无缝切换
- ✅ AI智能消费分析
- ✅ 定制化省钱建议
- ✅ 本地CSV存储，数据安全
- ✅ 响应式设计，适配多端
- ✅ 简洁美观的苹果风格UI

