// 交易记录类型
export interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note?: string
  image?: string // 图片文件名（存储在public/images/transactions/目录）
}

// 预算类型
export interface Budget {
  category: string
  amount: number
  spent: number
}

// 总预算设置
export interface TotalBudget {
  amount: number
  month: string
}

// 经济画像类型
export interface EconomicProfile {
  monthlyIncome: number
  mainCategories: string[]
  savingsGoal: number
  note?: string
}

// 消费分类类型
export type CategoryType = '餐饮' | '购物' | '娱乐' | '美妆' | '交通' | '住房' | '医疗' | '其他'

// 账号类型
export type AccountType = 'user1' | 'user2' | 'user3'

// AI建议响应类型
export interface AIAdvice {
  suggestions: string[]
  analysis: string
}

// 图表数据类型
export interface ChartData {
  name: string
  value: number
}

export interface TrendData {
  date: string
  amount: number
}

