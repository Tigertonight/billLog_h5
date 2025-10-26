import { NextRequest } from 'next/server'

// 尝试从两个可能的环境变量读取
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY
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
        stream: true, // 启用流式输出
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

    // 创建一个可读流用于SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim() !== '')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  continue
                }

                try {
                  const json = JSON.parse(data)
                  const content = json.choices?.[0]?.delta?.content
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
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

