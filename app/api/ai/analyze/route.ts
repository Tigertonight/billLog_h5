import { NextRequest } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: NextRequest) {
  // 详细的环境变量调试日志
  console.log('=== DeepSeek API Environment Check ===')
  console.log('Timestamp:', new Date().toISOString())
  console.log('DEEPSEEK_API_KEY exists:', !!DEEPSEEK_API_KEY)
  console.log('DEEPSEEK_API_KEY length:', DEEPSEEK_API_KEY?.length || 0)
  console.log('DEEPSEEK_API_KEY first 4 chars:', DEEPSEEK_API_KEY?.slice(0, 4) || 'NOT_SET')
  console.log('DEEPSEEK_API_KEY last 4 chars:', DEEPSEEK_API_KEY?.slice(-4) || 'NOT_SET')
  console.log('Expected length: 41, Actual length:', DEEPSEEK_API_KEY?.length || 0)
  console.log('=====================================')

  try {
    const { prompt } = await request.json()

    if (!DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的理财顾问，擅长分析消费数据并给出实用的省钱建议。请用中文回答，建议要具体、可操作，使用Markdown格式输出。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false, // 暂时禁用流式输出
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API error:', response.status, errorText)
      return new Response(
        JSON.stringify({ 
          error: 'DeepSeek API request failed',
          status: response.status,
          details: errorText 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return new Response(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error calling DeepSeek API:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to get AI response' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

