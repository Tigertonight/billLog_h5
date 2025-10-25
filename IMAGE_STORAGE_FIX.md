# 图片存储问题修复说明

## 问题描述

保存记录后，在时间轴的明细记录中无法查看到保存的图片。

## 问题原因

API路由在处理交易数据时，没有包含 `image` 字段，导致图片文件名没有被保存到CSV文件中。

### 问题定位

1. **CSV文件检查**：查看 `public/csv/user1.csv` 发现 `image` 列全部为空
2. **API代码检查**：发现两个API路由缺少image字段处理

## 修复内容

### 1. 添加交易API (`POST /api/csv/[userId]`)

**文件**: `app/api/csv/[userId]/route.ts`

**修复前**:
```typescript
const newTransaction: Transaction = {
  id: generateId(),
  date: body.date,
  category: body.category,
  amount: parseFloat(body.amount),
  note: body.note || '',
  // ❌ 缺少 image 字段
}
```

**修复后**:
```typescript
const newTransaction: Transaction = {
  id: generateId(),
  date: body.date,
  category: body.category,
  amount: parseFloat(body.amount),
  note: body.note || '',
  image: body.image || undefined, // ✅ 添加图片字段
}
```

### 2. 更新交易API (`PUT /api/csv/[userId]/[transactionId]`)

**文件**: `app/api/csv/[userId]/[transactionId]/route.ts`

**修复前**:
```typescript
const updatedTransaction: Transaction = {
  id: transactionId,
  date: body.date,
  category: body.category,
  amount: parseFloat(body.amount),
  note: body.note || '',
  // ❌ 缺少 image 字段
}
```

**修复后**:
```typescript
const updatedTransaction: Transaction = {
  id: transactionId,
  date: body.date,
  category: body.category,
  amount: parseFloat(body.amount),
  note: body.note || '',
  image: body.image || undefined, // ✅ 添加图片字段
}
```

## 验证方法

### 1. 测试新增记录
1. 在记账页面上传图片
2. 填写其他信息后保存
3. 打开时间线页面
4. ✅ 应该能看到图片缩略图

### 2. 测试编辑记录
1. 在时间线页面编辑一条记录
2. 上传新图片或修改现有图片
3. 保存后刷新页面
4. ✅ 图片应该正确更新

### 3. 检查CSV文件
```bash
cat public/csv/user1.csv
```

应该看到image列有值：
```csv
id,date,category,amount,note,image
xxx,2025-10-23,餐饮,30,星巴克,1729567890-abc123.jpg
```

## 图片存储流程

### 完整流程图

```
用户上传图片
    ↓
ImageUpload组件
    ↓
POST /api/upload
    ↓
保存到 public/images/transactions/
    ↓
返回文件名 (如: 1729567890-abc123.jpg)
    ↓
表单提交包含filename
    ↓
POST /api/csv/[userId]
    ↓
保存到CSV (image字段)
    ↓
时间线读取CSV
    ↓
显示图片 (/images/transactions/filename)
```

### 关键文件

1. **上传组件**: `components/ui/image-upload.tsx`
   - 处理图片上传
   - 返回文件名和base64

2. **上传API**: `app/api/upload/route.ts`
   - 保存文件到 `public/images/transactions/`
   - 返回 `{filename, url}`

3. **添加交易API**: `app/api/csv/[userId]/route.ts`
   - 接收 `body.image`
   - 保存到CSV

4. **更新交易API**: `app/api/csv/[userId]/[transactionId]/route.ts`
   - 接收 `body.image`
   - 更新CSV

5. **CSV处理**: `lib/csv.ts`
   - `transactionsToCSV()` 包含image列
   - `parseCSV()` 解析image字段

6. **时间线显示**: `app/timeline/page.tsx`
   - 读取 `transaction.image`
   - 渲染图片 `<Image src="/images/transactions/..." />`

## 数据结构

### Transaction接口 (`types/index.ts`)

```typescript
export interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note?: string
  image?: string  // 图片文件名（不含路径）
}
```

### CSV格式

```csv
id,date,category,amount,note,image
1729567890-abc,2025-10-23,餐饮,30,星巴克,1729567890-xyz.jpg
```

### 图片URL映射

- **CSV存储**: `1729567890-xyz.jpg`（仅文件名）
- **实际路径**: `public/images/transactions/1729567890-xyz.jpg`
- **访问URL**: `/images/transactions/1729567890-xyz.jpg`

## 注意事项

### 1. 图片文件管理

- 图片文件存储在 `public/images/transactions/`
- 删除交易记录时，**图片文件不会自动删除**
- 如需清理孤立图片，需要手动处理

### 2. 文件命名

- 格式：`{timestamp}-{randomString}.{extension}`
- 例如：`1729567890-abc123.jpg`
- 保证唯一性，避免冲突

### 3. 文件大小限制

- 最大：10MB
- 在 `app/api/upload/route.ts` 中定义

### 4. 支持的格式

- 图片：PNG, JPG, SVG
- 文档：PDF
- PDF显示为图标，不显示预览

## 已修复的功能

✅ **新增记录时保存图片**
- 上传图片后filename正确保存到CSV

✅ **编辑记录时更新图片**
- 可以修改现有记录的图片
- 可以删除图片（设为空）

✅ **时间线正确显示图片**
- 显示图片缩略图（20x20）
- 点击可放大预览

✅ **点击图片预览而非上传**
- 有图片时点击=预览
- 无图片时点击=上传

## 相关文档

- [AI识别功能说明](./AI_RECOGNITION.md)
- [UI优化说明](./UI_IMPROVEMENTS.md)
- [GLM配置指南](./GLM_SETUP_GUIDE.md)

---

**修复完成时间**: 2025-10-23  
**状态**: ✅ 已验证

