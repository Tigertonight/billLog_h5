'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAccount } from '@/contexts/AccountContext'
import { formatAmount, calculatePercentage } from '@/lib/utils'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { TrendingUp, Wallet } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface ChartData {
  name: string
  value: number
  amount: number
}

interface TrendData {
  date: string
  amount: number
}

export default function StatisticsPage() {
  const { transactions, budgets, totalBudget } = useAccount()
  const [categoryData, setCategoryData] = useState<ChartData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])

  // 计算总消费
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions])

  // 计算当前月份各分类的实际支出
  const currentMonthSpending = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const spending: Record<string, number> = {}

    transactions
      .filter((tx) => tx.date.startsWith(currentMonth))
      .forEach((tx) => {
        spending[tx.category] = (spending[tx.category] || 0) + tx.amount
      })

    return spending
  }, [transactions])

  // 计算本月总支出
  const currentMonthTotal = useMemo(() => {
    return Object.values(currentMonthSpending).reduce((sum, amount) => sum + amount, 0)
  }, [currentMonthSpending])

  // 计算预算统计
  const budgetStats = useMemo(() => {
    let categoryBudgetSum = 0
    let totalSpent = currentMonthTotal

    budgets.forEach((budget) => {
      categoryBudgetSum += budget.amount
    })

    // 使用设置的总预算，如果没有设置则使用分类预算总和
    const effectiveTotalBudget = totalBudget > 0 ? totalBudget : categoryBudgetSum

    return {
      totalBudget: effectiveTotalBudget,
      categoryBudgetSum,
      totalSpent,
      totalRemaining: effectiveTotalBudget - totalSpent,
      totalPercentage: calculatePercentage(totalSpent, effectiveTotalBudget),
      hasBudget: effectiveTotalBudget > 0,
    }
  }, [budgets, totalBudget, currentMonthTotal])

  // 处理分类数据
  useEffect(() => {
    if (transactions.length === 0) {
      setCategoryData([])
      return
    }

    const categoryMap: Record<string, number> = {}
    transactions.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount
    })

    const data = Object.entries(categoryMap).map(([name, amount]) => ({
      name,
      value: Math.round((amount / totalAmount) * 100),
      amount,
    }))

    setCategoryData(data)
  }, [transactions, totalAmount])

  // 处理趋势数据
  useEffect(() => {
    if (transactions.length === 0) {
      setTrendData([])
      return
    }

    const dateMap: Record<string, number> = {}
    transactions.forEach((tx) => {
      dateMap[tx.date] = (dateMap[tx.date] || 0) + tx.amount
    })

    const data = Object.entries(dateMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10) // 只显示最近10天

    setTrendData(data)
  }, [transactions])

  // 自定义工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            金额: ¥{payload[0].payload.amount.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            占比: {payload[0].value}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="消费统计" />
      
      <main className="container mx-auto px-4 py-6 page-content">
        {/* 预算概览 */}
        {budgetStats.hasBudget && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                本月预算概览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">总预算</span>
                  <span className="text-lg font-bold">
                    {formatAmount(budgetStats.totalBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">已支出</span>
                  <span className="text-lg font-bold text-primary">
                    {formatAmount(budgetStats.totalSpent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">剩余</span>
                  <span
                    className={`text-lg font-bold ${
                      budgetStats.totalRemaining < 0
                        ? 'text-destructive'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {formatAmount(budgetStats.totalRemaining)}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>使用进度</span>
                    <span>{budgetStats.totalPercentage}%</span>
                  </div>
                  <Progress
                    value={budgetStats.totalSpent}
                    max={budgetStats.totalBudget}
                    indicatorClassName={
                      budgetStats.totalPercentage >= 100
                        ? 'bg-destructive'
                        : budgetStats.totalPercentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 总消费卡片 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">总消费</p>
              <p className="text-4xl font-bold text-primary">
                ¥{totalAmount.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                共 {transactions.length} 笔记录
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 图表区域 */}
        {transactions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* 分类占比饼图 */}
            <Card>
              <CardHeader>
                <CardTitle>分类占比</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 消费趋势柱状图 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  消费趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`¥${value.toFixed(2)}`, '消费金额']}
                      labelFormatter={(label) => {
                        const date = new Date(label)
                        return date.toLocaleDateString('zh-CN')
                      }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">暂无消费数据</p>
                <p className="text-sm">请先在记账页面添加一些记录</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

