import Papa from 'papaparse'
import { Transaction } from '@/types'

// CSV文件存储路径前缀
const CSV_BASE_PATH = '/csv'

/**
 * 获取指定账号的CSV文件路径
 */
export function getCSVPath(userId: string): string {
  return `${CSV_BASE_PATH}/${userId}.csv`
}

/**
 * 解析CSV内容为Transaction数组
 */
export function parseCSV(csvContent: string): Transaction[] {
  const result = Papa.parse<Transaction>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value, field) => {
      // 转换amount字段为数字
      if (field === 'amount') {
        return parseFloat(value) || 0
      }
      return value.trim()
    }
  })
  
  return result.data
}

/**
 * 将Transaction数组转换为CSV格式
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const csv = Papa.unparse(transactions, {
    header: true,
    columns: ['id', 'date', 'category', 'amount', 'note', 'image']
  })
  return csv
}

/**
 * 从服务器读取CSV数据
 */
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  try {
    const response = await fetch(`/api/csv/${userId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }
    const data = await response.json()
    return data.transactions || []
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}

/**
 * 添加新的交易记录
 */
export async function addTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const response = await fetch(`/api/csv/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })
  
  if (!response.ok) {
    throw new Error('Failed to add transaction')
  }
  
  const data = await response.json()
  return data.transaction
}

/**
 * 更新交易记录
 */
export async function updateTransaction(
  userId: string,
  transaction: Transaction
): Promise<Transaction> {
  const response = await fetch(`/api/csv/${userId}/${transaction.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update transaction')
  }
  
  const data = await response.json()
  return data.transaction
}

/**
 * 删除交易记录
 */
export async function deleteTransaction(
  userId: string,
  transactionId: string
): Promise<void> {
  const response = await fetch(`/api/csv/${userId}/${transactionId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete transaction')
  }
}

/**
 * 初始化用户CSV文件(如果不存在)
 */
export function initializeCSV(): string {
  return 'id,date,category,amount,note,image\n'
}

