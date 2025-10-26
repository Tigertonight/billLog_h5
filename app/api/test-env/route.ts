import { NextResponse } from 'next/server'

/**
 * 临时测试端点 - 用于验证环境变量是否正确加载
 * 部署后访问: /api/test-env
 */
export async function GET() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const glmKey = process.env.GLM_API_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    environmentVariables: {
      DEEPSEEK_API_KEY: {
        exists: !!deepseekKey,
        length: deepseekKey?.length || 0,
        first4: deepseekKey?.slice(0, 4) || 'NOT_SET',
        last4: deepseekKey?.slice(-4) || 'NOT_SET',
        expectedLength: 41,
        isCorrectLength: deepseekKey?.length === 41,
      },
      GLM_API_KEY: {
        exists: !!glmKey,
        length: glmKey?.length || 0,
        last4: glmKey?.slice(-4) || 'NOT_SET',
      },
      NEXT_PUBLIC_SUPABASE_URL: {
        exists: !!supabaseUrl,
        value: supabaseUrl || 'NOT_SET',
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!supabaseAnonKey,
        length: supabaseAnonKey?.length || 0,
        last4: supabaseAnonKey?.slice(-4) || 'NOT_SET',
      },
    },
    allVariablesConfigured: !!(deepseekKey && supabaseUrl && supabaseAnonKey),
  })
}

