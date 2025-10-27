import { NextRequest } from 'next/server'

// 从服务端环境变量读取
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// Vercel 完美支持 SSE 流式响应
const ENABLE_STREAMING = process.env.ENABLE_STREAMING === 'true'

export async function POST(request: NextRequest) {
  console.log('🤖 AI 分析请求 -', new Date().toISOString())
  console.log('📡 流式响应:', ENABLE_STREAMING ? '✅ 已启用' : '❌ 已禁用')

  try {
    const { prompt } = await request.json()

    const apiKey = DEEPSEEK_API_KEY
    
    if (!apiKey) {
      console.error('❌ DEEPSEEK_API_KEY 未配置')
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!prompt) {
      console.error('❌ Prompt 缺失')
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('📤 调用 DeepSeek API...')
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
        stream: ENABLE_STREAMING, // 根据环境变量决定是否启用流式输出
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

    // 根据是否启用流式输出返回不同格式
    if (ENABLE_STREAMING) {
      // 真正的 SSE 流式响应（Vercel 环境）
      console.log('🚀 启动 SSE 流式传输')
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader()
          if (!reader) {
            console.error('❌ 无响应体')
            controller.close()
            return
          }

          const decoder = new TextDecoder()
          let chunkCount = 0
          
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                console.log(`✅ 流式传输完成，共 ${chunkCount} 个数据块`)
                break
              }

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n').filter(line => line.trim() !== '')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim()
                  if (data === '[DONE]') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    continue
                  }

                  try {
                    const json = JSON.parse(data)
                    const content = json.choices?.[0]?.delta?.content
                    if (content) {
                      chunkCount++
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                    }
                  } catch (e) {
                    console.error('❌ 解析 SSE 数据失败:', e, '数据:', data)
                  }
                }
              }
            }
          } catch (error) {
            console.error('❌ 读取流失败:', error)
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
    } else {
      // 非流式响应（降级方案）
      console.log('⚠️ 使用非流式响应')
      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''

      return new Response(
        JSON.stringify({ content }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
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

