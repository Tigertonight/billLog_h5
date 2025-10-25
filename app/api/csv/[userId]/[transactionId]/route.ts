import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types'

// PUT: 更新交易记录
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; transactionId: string } }
) {
  try {
    const { userId, transactionId } = params
    const body = await request.json()
    
    // 更新记录
    const updatedData = {
      date: body.date,
      category: body.category,
      amount: parseFloat(body.amount),
      note: body.note || '',
      image_url: body.image || null,
    }
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedData)
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        )
      }
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
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE: 删除交易记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; transactionId: string } }
) {
  try {
    const { userId, transactionId } = params
    
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

