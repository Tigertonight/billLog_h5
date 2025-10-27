import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const enableStreaming = process.env.ENABLE_STREAMING
  
  return new Response(
    JSON.stringify({
      ENABLE_STREAMING: enableStreaming,
      ENABLE_STREAMING_TYPE: typeof enableStreaming,
      ENABLE_STREAMING_EQUALS_TRUE: enableStreaming === 'true',
      ENABLE_STREAMING_BOOLEAN: enableStreaming === true,
      ALL_ENV_KEYS: Object.keys(process.env).filter(k => k.includes('STREAMING'))
    }, null, 2),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

