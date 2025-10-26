import { NextRequest, NextResponse } from 'next/server'
import { parseReceiptImageGLM } from '@/lib/deepseek'

export async function POST(request: NextRequest) {
  try {
    // 运行时环境变量检查
    console.log('=== GLM API Environment Check ===')
    console.log('GLM_API_KEY exists:', !!process.env.GLM_API_KEY)
    console.log('GLM_API_KEY length:', process.env.GLM_API_KEY?.length || 0)
    console.log('==================================')
    
    const { imageBase64 } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      )
    }

    // 验证是否是图片格式（不支持PDF）
    if (!imageBase64.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Only image formats are supported for AI recognition. PDF files cannot be analyzed.' },
        { status: 400 }
      )
    }

    // 使用智谱GLM-4V进行图片识别
    const result = await parseReceiptImageGLM(imageBase64)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error parsing receipt:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to parse receipt',
        success: false 
      },
      { status: 500 }
    )
  }
}

