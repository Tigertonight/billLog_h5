import { Transaction, EconomicProfile, CategoryType } from '@/types'

/**
 * 票据识别结果接口
 */
export interface ReceiptParseResult {
  amount: number | null
  category: CategoryType | null
  date: string | null
  note: string | null
  error?: string // 错误标识，如 "UNRECOGNIZABLE"
}

/**
 * 调用DeepSeek API获取AI建议（非流式）
 */
async function callDeepSeekAPIStream(
  prompt: string,
  onChunk: (content: string) => void
): Promise<void> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('API error:', errorData)
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    if (data.content) {
      onChunk(data.content)
    } else {
      throw new Error('No content in response')
    }
  } catch (error) {
    console.error('Error calling DeepSeek API:', error)
    throw error
  }
}

/**
 * 分析消费数据并获取省钱建议（流式）
 */
export async function analyzeSpending(
  transactions: Transaction[],
  onChunk: (content: string) => void
): Promise<void> {
  // 统计各分类消费
  const categoryStats: Record<string, number> = {}
  let totalAmount = 0

  transactions.forEach((tx) => {
    categoryStats[tx.category] = (categoryStats[tx.category] || 0) + tx.amount
    totalAmount += tx.amount
  })

  // 计算分类占比
  const categoryRatios = Object.entries(categoryStats).map(([category, amount]) => ({
    category,
    amount: amount.toFixed(2),
    ratio: ((amount / totalAmount) * 100).toFixed(1) + '%'
  }))

  const prompt = `
作为一名专业的理财顾问，请分析以下消费数据并给出3条具体的省钱建议：

消费总额：¥${totalAmount.toFixed(2)}
消费记录数：${transactions.length}条

各分类消费情况：
${categoryRatios.map(c => `- ${c.category}：¥${c.amount} (占比${c.ratio})`).join('\n')}

请给出：
1. 消费模式分析
2. 3条具体的省钱建议
3. 优化消费的方法

要求：建议要具体、可操作，符合中国用户的消费习惯。使用Markdown格式输出。
`

  await callDeepSeekAPIStream(prompt, onChunk)
}

/**
 * 根据经济画像生成定制化建议（流式）
 */
export async function generateProfileAdvice(
  profile: EconomicProfile,
  transactions: Transaction[],
  onChunk: (content: string) => void
): Promise<void> {
  // 计算当前月支出
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlySpending = transactions
    .filter(tx => tx.date.startsWith(currentMonth))
    .reduce((sum, tx) => sum + tx.amount, 0)

  const prompt = `
作为一名专业的理财顾问，请根据用户的经济画像和消费数据，给出定制化的省钱和理财建议：

用户经济画像：
- 月收入：¥${profile.monthlyIncome}
- 主要消费分类：${profile.mainCategories.join('、')}
- 储蓄目标：每月¥${profile.savingsGoal}
${profile.note ? `- 补充说明：${profile.note}` : ''}

当前消费情况：
- 本月已支出：¥${monthlySpending.toFixed(2)}
- 距离储蓄目标差距：¥${Math.max(0, profile.monthlyIncome - monthlySpending - profile.savingsGoal).toFixed(2)}

请给出：
1. 整体财务状况分析
2. 至少3条针对性的省钱建议
3. 如何实现储蓄目标的具体方法
4. 长期理财规划建议

要求：建议要个性化、实用、可执行，考虑用户的实际收入和消费习惯。使用Markdown格式输出。
`

  await callDeepSeekAPIStream(prompt, onChunk)
}

/**
 * 使用智谱GLM-4V解析票据图片，提取消费信息
 * @param imageBase64 图片的Base64编码（包含data:image前缀）
 * @returns 解析结果，未识别的字段返回null
 */
export async function parseReceiptImageGLM(imageBase64: string): Promise<ReceiptParseResult> {
  const apiKey = process.env.GLM_API_KEY
  if (!apiKey) {
    throw new Error('GLM_API_KEY is not configured')
  }

  const prompt = `分析图片，提取票据信息，只返回JSON，不要其他文字。

规则：
- 只提取图片中明确显示的信息，不推测、不补充
- 未显示的字段返回null

字段：
1. amount（数字）：金额，去除货币符号
2. category（文本）：类别，只能是：餐饮、购物、娱乐、美妆、交通、住房、医疗、其他
3. date（文本）：日期，格式YYYY-MM-DD，缺年份返回null
4. note（文本）：商家名称或描述

返回格式（只返回JSON，不要任何额外文字）：
{"amount": 100, "category": "餐饮", "date": "2025-10-23", "note": "星巴克"}

或无法识别时：
{"error": "UNRECOGNIZABLE"}

字段为null示例：
{"amount": 50, "category": "购物", "date": null, "note": "超市"}

立即开始分析，只返回JSON：`

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4v',
        messages: [
          {
            role: 'system',
            content: '你是票据OCR助手，只输出JSON格式，不要解释或对话。'
          },
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
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.05,  // 降低随机性
        max_tokens: 200,    // 减少token，JSON很短
        top_p: 0.7
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('GLM API error:', errorData)
      throw new Error(`GLM API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log('Full GLM API response:', JSON.stringify(data, null, 2))
    
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('Unexpected GLM response:', data)
      throw new Error('No content in GLM response')
    }

    // 解析JSON响应
    console.log('=== GLM Response Debug ===')
    console.log('Raw content length:', content.length)
    console.log('Raw content:', content)
    console.log('Content type:', typeof content)
    
    // 检查content是否为空
    if (!content || content.trim() === '') {
      console.error('Empty content received from GLM')
      throw new Error('Empty response from AI')
    }
    
    // 移除可能的markdown代码块标记
    let jsonText = content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/`/g, '') // 移除单个反引号
      .trim()
    
    console.log('After removing markdown:', jsonText)
    
    // 尝试提取JSON对象（处理AI可能添加的额外文字）
    // 查找第一个 { 和最后一个 }
    const firstBrace = jsonText.indexOf('{')
    const lastBrace = jsonText.lastIndexOf('}')
    
    console.log('First brace at:', firstBrace, 'Last brace at:', lastBrace)
    console.log('Text length:', jsonText.length)
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      console.error('No valid JSON braces found!')
      console.error('Full text:', jsonText)
      console.error('First 200 chars:', jsonText.substring(0, 200))
      
      // 如果完全找不到JSON，返回无法识别错误
      return {
        amount: null,
        category: null,
        date: null,
        note: null,
        error: 'UNRECOGNIZABLE'
      }
    }
    
    jsonText = jsonText.substring(firstBrace, lastBrace + 1)
    console.log('Extracted JSON:', jsonText)
    
    // 清理可能的特殊字符和空白
    jsonText = jsonText
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // 零宽字符
      .replace(/\r\n/g, '\n') // 统一换行符
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 控制字符
      .trim()
    
    console.log('Cleaned JSON text:', jsonText)
    
    // 解析JSON
    let result: ReceiptParseResult
    try {
      result = JSON.parse(jsonText)
      console.log('Parsed successfully:', result)
    } catch (parseError) {
      console.error('=== JSON Parse Error ===')
      console.error('Parse error:', parseError)
      console.error('Failed JSON text:', jsonText)
      const chars = jsonText.substring(0, 100).split('')
      console.error('First 100 character codes:', chars.map((c: string) => c.charCodeAt(0)))
      
      // 解析失败，返回无法识别错误
      return {
        amount: null,
        category: null,
        date: null,
        note: null,
        error: 'UNRECOGNIZABLE'
      }
    }

    // 检查是否是无法识别的错误
    if (result.error === 'UNRECOGNIZABLE') {
      return result // 直接返回错误标识
    }

    // 验证类别字段
    const validCategories: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']
    if (result.category && !validCategories.includes(result.category)) {
      result.category = null // 无效类别设为null
    }

    return result
  } catch (error) {
    console.error('Error parsing receipt with GLM:', error)
    throw error
  }
}

/**
 * 解析票据图片，提取消费信息（DeepSeek版本 - 已废弃）
 * @deprecated 使用 parseReceiptImageGLM 代替
 * @param imageBase64 图片的Base64编码（包含data:image前缀）
 * @returns 解析结果，未识别的字段返回null
 * 
 * 注意：DeepSeek当前的chat/completions API可能不支持视觉功能
 * 如果遇到400错误，可能需要：
 * 1. 使用DeepSeek专门的多模态端点（如果有）
 * 2. 或使用其他支持视觉的API（如OpenAI GPT-4V）
 */
export async function parseReceiptImage(imageBase64: string): Promise<ReceiptParseResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
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
    // 尝试方法1：OpenAI兼容格式（可能不被DeepSeek支持）
    let response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    })

    // 如果返回400，尝试DeepSeek专用格式
    if (response.status === 400) {
      console.log('Trying DeepSeek v3/multimodal endpoint...')
      
      // 移除data:image前缀，只保留base64数据
      const base64Data = imageBase64.split(',')[1] || imageBase64
      
      response = await fetch('https://api.deepseek.com/v3/multimodal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            text: prompt,
            image: base64Data
          },
          parameters: {
            response_format: 'json',
            max_tokens: 500
          }
        }),
      })
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('DeepSeek API error:', errorData)
      
      // 提供更详细的错误信息
      if (response.status === 400) {
        throw new Error('DeepSeek当前可能不支持视觉功能。建议：1) 检查API文档确认正确的多模态端点 2) 或使用支持视觉的其他API（如OpenAI GPT-4V）')
      }
      
      throw new Error(`DeepSeek API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    
    // 兼容不同的响应格式
    let content = data.choices?.[0]?.message?.content || data.result || data.output
    
    if (!content) {
      console.error('Unexpected API response:', data)
      throw new Error('No content in DeepSeek response')
    }

    // 解析JSON响应
    // 移除可能的markdown代码块标记
    const jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result: ReceiptParseResult = JSON.parse(jsonText)

    // 验证类别字段
    const validCategories: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']
    if (result.category && !validCategories.includes(result.category)) {
      result.category = null // 无效类别设为null
    }

    return result
  } catch (error) {
    console.error('Error parsing receipt:', error)
    throw error
  }
}

