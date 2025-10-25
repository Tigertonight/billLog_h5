import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types'
import { generateId } from '@/lib/utils'

// GET: 获取用户的所有交易记录
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    
    // 从 Supabase 查询数据
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    // 将数据库格式转换为应用格式
    const transactions: Transaction[] = (data || []).map(row => ({
      id: row.id,
      date: row.date,
      category: row.category,
      amount: parseFloat(row.amount),
      note: row.note || '',
      image: row.image_url || undefined,
    }))
    
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error reading transactions:', error)
    return NextResponse.json(
      { error: 'Failed to read transactions' },
      { status: 500 }
    )
  }
}

// POST: 添加新的交易记录
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    const body = await request.json()
    
    // 创建新记录
    const newTransaction = {
      id: generateId(),
      user_id: userId,
      date: body.date,
      category: body.category,
      amount: parseFloat(body.amount),
      note: body.note || '',
      image_url: body.image || null,
    }
    
    // 插入到 Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    // 转换为应用格式返回
    const transaction: Transaction = {
      id: data.id,
      date: data.date,
      category: data.category,
      amount: parseFloat(data.amount),
      note: data.note || '',
      image: data.image_url || undefined,
    }
    
    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error adding transaction:', error)
    return NextResponse.json(
      { error: 'Failed to add transaction' },
      { status: 500 }
    )
  }
}

