# AI识别功能故障排查指南

## 当前问题：DeepSeek API 400错误

### 问题原因

DeepSeek的标准`chat/completions` API **可能不支持视觉/图片输入功能**。400错误通常表示请求格式不被接受。

根据最新调研：
- DeepSeek主要提供文本对话API
- 多模态（图片识别）功能可能需要使用专门的端点
- 或者DeepSeek当前版本尚未完全开放视觉API

### 已实现的兼容处理

代码中已添加自动降级策略：
1. 首先尝试OpenAI兼容格式的`/chat/completions`
2. 如果返回400，自动尝试`/v3/multimodal`端点
3. 如果仍然失败，返回详细错误信息

## 解决方案

### 方案1：使用OpenAI GPT-4 Vision（推荐）

OpenAI的GPT-4V是目前最成熟的视觉理解API。

#### 步骤：

1. **获取OpenAI API密钥**
   - 访问 https://platform.openai.com/
   - 创建API密钥

2. **添加环境变量**
   ```env
   # .env.local
   OPENAI_API_KEY=sk-your-openai-api-key
   DEEPSEEK_API_KEY=your-deepseek-api-key  # 用于文本分析
   ```

3. **创建OpenAI版本的识别函数**

   在`lib/deepseek.ts`中添加：

   ```typescript
   export async function parseReceiptImageOpenAI(imageBase64: string): Promise<ReceiptParseResult> {
     const apiKey = process.env.OPENAI_API_KEY
     if (!apiKey) {
       throw new Error('OPENAI_API_KEY is not configured')
     }

     const prompt = `你是一个专业的票据识别助手。请分析这张图片，提取以下信息：

   1. 金额（amount）- 数字，单位：元
   2. 消费类别（category）- 必须从以下选项中选择：餐饮、购物、娱乐、美妆、交通、住房、医疗、其他
   3. 日期（date）- 格式：YYYY-MM-DD
   4. 备注（note）- 商家名称或消费描述

   重要规则：
   - 如果某个字段无法识别，请返回 null
   - 金额必须是纯数字，不要包含货币符号
   - 类别必须严格匹配上述8个选项之一
   - 日期必须是标准格式，如果图片中没有年份，使用当前年份

   请以JSON格式返回，格式如下：
   {
     "amount": 数字或null,
     "category": "类别"或null,
     "date": "YYYY-MM-DD"或null,
     "note": "备注文字"或null
   }

   只返回JSON，不要有其他说明文字。`

     try {
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${apiKey}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           model: 'gpt-4-vision-preview', // 或 'gpt-4o'
           messages: [
             {
               role: 'user',
               content: [
                 {
                   type: 'text',
                   text: prompt
                 },
                 {
                   type: 'image_url',
                   image_url: {
                     url: imageBase64,
                     detail: 'auto' // 或 'high' 以获得更好的识别
                   }
                 }
               ]
             }
           ],
           max_tokens: 500
         }),
       })

       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}))
         console.error('OpenAI API error:', errorData)
         throw new Error(`OpenAI API error: ${response.status}`)
       }

       const data = await response.json()
       const content = data.choices?.[0]?.message?.content

       if (!content) {
         throw new Error('No content in OpenAI response')
       }

       const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
       const result: ReceiptParseResult = JSON.parse(jsonText)

       const validCategories: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']
       if (result.category && !validCategories.includes(result.category)) {
         result.category = null
       }

       return result
     } catch (error) {
       console.error('Error parsing receipt with OpenAI:', error)
       throw error
     }
   }
   ```

4. **修改API路由使用OpenAI**

   编辑 `app/api/ai/parse-receipt/route.ts`:

   ```typescript
   import { parseReceiptImageOpenAI } from '@/lib/deepseek'
   
   // 将 parseReceiptImage 改为 parseReceiptImageOpenAI
   const result = await parseReceiptImageOpenAI(imageBase64)
   ```

### 方案2：使用其他OCR服务

如果不想使用OpenAI，可以考虑：

#### 2.1 腾讯云OCR
- 支持票据识别
- 中文识别准确率高
- 价格实惠

#### 2.2 百度OCR
- 专门的票据识别API
- 支持增值税发票、火车票等
- 免费额度较高

#### 2.3 阿里云OCR
- 通用文字识别
- 支持表格识别

### 方案3：等待DeepSeek多模态支持

如果想继续使用DeepSeek：

1. **关注官方文档更新**
   - 访问：https://platform.deepseek.com/docs

2. **联系DeepSeek技术支持**
   - 询问多模态API的正确使用方式
   - 确认是否有beta版本可申请

3. **临时禁用图片识别**
   - 保留上传功能
   - 暂时隐藏"智能识别"按钮

## 临时禁用方案

如果暂时不想使用图片识别，可以：

### 修改记账页面

编辑 `app/page.tsx`:

```typescript
// 注释掉或删除智能识别按钮
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={handleSmartRecognition}
  disabled={true}  // 直接禁用
  className="w-full opacity-50 cursor-not-allowed"
>
  <Sparkles className="h-4 w-4 mr-2" />
  智能识别（暂未开放）
</Button>
```

或者完全移除该按钮部分。

## 成本对比

| 服务 | 价格 | 适用场景 |
|-----|------|---------|
| OpenAI GPT-4V | ~$0.01/次 | 高准确率需求 |
| 腾讯云OCR | ~¥0.005/次 | 中文票据 |
| 百度OCR | 前1000次免费 | 测试、小规模 |
| 阿里云OCR | ~¥0.006/次 | 通用文字识别 |

## 推荐方案

**对于您的项目，我推荐使用 OpenAI GPT-4 Vision**，原因：

1. ✅ API稳定可靠，文档完善
2. ✅ 视觉理解能力强，识别准确率高
3. ✅ 代码几乎不需要修改，只需替换API端点
4. ✅ 支持中文识别
5. ✅ 可以理解复杂的票据格式

## 下一步操作

请告诉我您希望：
1. **立即切换到OpenAI GPT-4V**（我可以帮您实现）
2. **尝试国内OCR服务**（如腾讯云、百度）
3. **暂时禁用图片识别功能**
4. **等待DeepSeek支持并手动测试**

我可以根据您的选择立即进行相应的代码调整。

