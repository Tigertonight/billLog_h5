# 项目设置指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 文件并重命名为 `.env.local`：

```bash
cp .env.local.example .env.local
```

然后编辑 `.env.local` 文件，添加你的 DeepSeek API 密钥：

```env
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 官网](https://www.deepseek.com/)
2. 注册账号并登录
3. 在控制台中创建 API 密钥
4. 将密钥复制到 `.env.local` 文件中

## 项目结构说明

```
billLog_h5/
├── app/                      # Next.js App Router 页面
│   ├── page.tsx             # 首页（快速记账）
│   ├── statistics/          # 统计分析页
│   ├── timeline/            # 时间线记录页
│   ├── budget/              # 预算管理页
│   ├── profile/             # 我的页面
│   └── api/                 # API 路由
│       ├── csv/             # CSV 操作 API
│       └── ai/              # AI 分析 API
├── components/              # React 组件
│   ├── ui/                  # Shadcn UI 组件
│   └── layout/              # 布局组件
├── contexts/                # React Context
│   ├── ThemeContext.tsx     # 主题管理
│   └── AccountContext.tsx   # 账号管理
├── lib/                     # 工具函数
│   ├── csv.ts              # CSV 处理
│   ├── deepseek.ts         # DeepSeek API
│   └── utils.ts            # 通用工具
├── types/                   # TypeScript 类型
└── public/                  # 静态资源
    └── csv/                # CSV 数据文件
```

## 功能说明

### 1. 多账号管理
- 支持 3 个独立账号（user1, user2, user3）
- 每个账号的数据完全隔离
- 可通过右上角下拉框切换账号

### 2. 快速记账
- 选择消费分类（餐饮、购物、娱乐等）
- 输入金额和日期
- 添加备注说明
- 点击保存即可完成记账

### 3. 统计分析
- 分类占比饼图
- 消费趋势柱状图
- AI 智能分析消费模式
- 提供省钱建议

### 4. 时间线记录
- 按时间倒序查看所有记录
- 支持编辑记录
- 支持删除记录
- 按日期分组显示

### 5. 预算管理
- 为各分类设置月度预算
- 实时显示预算使用情况
- 超支自动预警提醒
- 进度条可视化展示

### 6. 我的页面
- 设置经济画像（月收入、主要消费分类、储蓄目标）
- AI 根据画像提供定制化建议
- 查看本月消费和储蓄情况

## 数据存储

### CSV 文件
- 每个账号对应一个独立的 CSV 文件
- 文件存储在 `public/csv/` 目录
- 首次运行时自动创建并填充示例数据

### LocalStorage
- 预算设置存储在浏览器本地
- 经济画像存储在浏览器本地
- 主题设置和当前账号存储在本地

## 明暗模式

应用支持明暗模式切换：
- 点击右上角的月亮/太阳图标切换
- 自动记住用户的选择
- 首次访问时根据系统偏好设置

## 注意事项

1. **API 密钥安全**：不要将 `.env.local` 文件提交到 Git
2. **数据备份**：CSV 文件包含用户数据，建议定期备份
3. **浏览器兼容性**：推荐使用 Chrome、Safari、Edge 等现代浏览器
4. **网络要求**：AI 功能需要网络连接访问 DeepSeek API

## 常见问题

### Q: AI 建议功能不工作？
A: 请检查：
1. `.env.local` 文件是否正确配置
2. DeepSeek API 密钥是否有效
3. 网络连接是否正常

### Q: 数据丢失了？
A: 检查：
1. 浏览器是否清除了本地存储
2. `public/csv/` 目录下的 CSV 文件是否完整
3. 是否切换了不同的账号

### Q: 如何导出数据？
A: CSV 文件位于 `public/csv/` 目录下，可以直接复制备份

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 库**: Shadcn UI + Tailwind CSS
- **图表**: Recharts
- **数据处理**: PapaParse (CSV)
- **AI**: DeepSeek API
- **语言**: TypeScript
- **样式**: Tailwind CSS

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

