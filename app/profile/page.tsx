'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { useAccount } from '@/contexts/AccountContext'
import { formatAmount, calculatePercentage } from '@/lib/utils'
import { EconomicProfile, Budget, CategoryType } from '@/types'
import { User, DollarSign, Target, FileText, ChevronDown, ChevronUp, Wallet, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react'

const DEFAULT_CATEGORIES: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']

export default function ProfilePage() {
  const { transactions, profile, updateProfile, budgets, totalBudget, updateBudgets, updateTotalBudget } = useAccount()
  
  // 经济画像相关状态
  const [formData, setFormData] = useState<EconomicProfile>({
    monthlyIncome: 0,
    mainCategories: [],
    savingsGoal: 0,
    note: '',
  })
  const [categoriesInput, setCategoriesInput] = useState('')
  
  // 预算设置相关状态
  const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({})
  const [totalBudgetInput, setTotalBudgetInput] = useState('')
  
  // 折叠状态
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [isBudgetExpanded, setIsBudgetExpanded] = useState(false)
  
  const [message, setMessage] = useState('')

  // 初始化经济画像表单数据
  useEffect(() => {
    if (profile) {
      setFormData(profile)
      setCategoriesInput(profile.mainCategories.join('，'))
    }
  }, [profile])

  // 初始化预算输入
  useEffect(() => {
    const inputs: Record<string, string> = {}
    budgets.forEach((budget) => {
      inputs[budget.category] = budget.amount.toString()
    })
    DEFAULT_CATEGORIES.forEach((cat) => {
      if (!inputs[cat]) {
        inputs[cat] = ''
      }
    })
    setBudgetInputs(inputs)
    setTotalBudgetInput(totalBudget > 0 ? totalBudget.toString() : '')
  }, [budgets, totalBudget])

  // 保存经济画像
  const handleSaveProfile = () => {
    const categories = categoriesInput
      .split(/[,，]/)
      .map((c) => c.trim())
      .filter((c) => c.length > 0)

    const newProfile: EconomicProfile = {
      ...formData,
      mainCategories: categories,
    }

    updateProfile(newProfile)
    setMessage('经济画像保存成功！')
    setTimeout(() => setMessage(''), 3000)
  }

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

  // 计算本月可储蓄金额
  const currentSavings = formData.monthlyIncome - currentMonthTotal

  // 保存预算
  const handleSaveBudgets = () => {
    const newBudgets: Budget[] = []

    DEFAULT_CATEGORIES.forEach((category) => {
      const amount = parseFloat(budgetInputs[category] || '0')
      if (amount > 0) {
        newBudgets.push({
          category,
          amount,
          spent: currentMonthSpending[category] || 0,
        })
      }
    })

    // 保存总预算
    const totalBudgetAmount = parseFloat(totalBudgetInput || '0')
    if (totalBudgetAmount > 0) {
      updateTotalBudget(totalBudgetAmount)
    }

    updateBudgets(newBudgets)
    setMessage('预算保存成功！')
    setTimeout(() => setMessage(''), 3000)
  }

  // 获取预算状态
  const getBudgetStatus = (category: string) => {
    const budget = budgets.find((b) => b.category === category)
    if (!budget || budget.amount === 0) return null

    const spent = currentMonthSpending[category] || 0
    const percentage = calculatePercentage(spent, budget.amount)
    const remaining = budget.amount - spent

    return {
      budget: budget.amount,
      spent,
      remaining,
      percentage,
      isOverBudget: spent > budget.amount,
      isNearLimit: percentage >= 80 && percentage < 100,
    }
  }

  // 计算总预算统计
  const totalStats = useMemo(() => {
    let categoryBudgetSum = 0

    budgets.forEach((budget) => {
      categoryBudgetSum += budget.amount
    })

    return {
      categoryBudgetSum,
    }
  }, [budgets])

  return (
    <div className="min-h-screen bg-background">
      <Header title="我的" />
      
      <main className="container mx-auto px-4 py-6 page-content">
        {/* 账号信息卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              账号信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">当前账号</span>
                <span className="font-medium">{useAccount().currentAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">总记录数</span>
                <span className="font-medium">{transactions.length} 笔</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">本月支出</span>
                <span className="font-medium text-primary">
                  ¥{currentMonthTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 经济画像设置 - 可折叠 */}
        <Card className="mb-6">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          >
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                经济画像
              </span>
              {isProfileExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
          {isProfileExpanded && (
            <CardContent>
            <div className="space-y-4">
              {/* 月收入 */}
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  月收入（元）
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="请输入月收入"
                  value={formData.monthlyIncome || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, monthlyIncome: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              {/* 主要消费分类 */}
              <div className="space-y-2">
                <Label htmlFor="categories" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  主要消费分类
                </Label>
                <Input
                  id="categories"
                  placeholder="例如：餐饮，购物，娱乐"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">用逗号分隔多个分类</p>
              </div>

              {/* 储蓄目标 */}
              <div className="space-y-2">
                <Label htmlFor="savingsGoal" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  每月储蓄目标（元）
                </Label>
                <Input
                  id="savingsGoal"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="请输入储蓄目标"
                  value={formData.savingsGoal || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, savingsGoal: parseFloat(e.target.value) || 0 })
                  }
                />
                {formData.monthlyIncome > 0 && formData.savingsGoal > 0 && (
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      本月可支配金额: ¥{(formData.monthlyIncome - formData.savingsGoal).toFixed(2)}
                    </p>
                    <p
                      className={
                        currentSavings >= formData.savingsGoal
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }
                    >
                      本月预计储蓄: ¥{currentSavings.toFixed(2)}
                      {currentSavings >= formData.savingsGoal ? ' ✓ 已达标' : ' ⚠ 未达标'}
                    </p>
                  </div>
                )}
              </div>

              {/* 其他说明 */}
              <div className="space-y-2">
                <Label htmlFor="note">其他说明（选填）</Label>
                <Textarea
                  id="note"
                  placeholder="例如：经常加班所以餐饮开销大，每月需还房贷3000元..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                />
              </div>

              {/* 保存按钮 */}
              <Button onClick={handleSaveProfile} className="w-full">
                保存经济画像
              </Button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* 预算设置 - 可折叠 */}
        <Card className="mb-6">
          <CardHeader 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
          >
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                预算设置
              </span>
              {isBudgetExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
          {isBudgetExpanded && (
            <CardContent>
              <div className="space-y-6">
                {/* 总预算设置 */}
                <div className="space-y-2">
                  <Label htmlFor="total-budget">本月总预算（元）</Label>
                  <Input
                    id="total-budget"
                    type="number"
                    step="any"
                    min="0"
                    placeholder="设置本月总预算金额"
                    value={totalBudgetInput}
                    onChange={(e) => setTotalBudgetInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 设置总预算可以统筹管理整体消费，分类预算用于细分控制
                  </p>
                  {totalStats.categoryBudgetSum > 0 && totalBudget > 0 && (
                    <p className="text-xs text-muted-foreground">
                      当前分类预算总和：{formatAmount(totalStats.categoryBudgetSum)}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-4">分类预算</h4>
                  <div className="space-y-4">
                    {DEFAULT_CATEGORIES.map((category) => {
                      const status = getBudgetStatus(category)

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`budget-${category}`} className="font-medium">
                              {category}
                            </Label>
                            {status && (
                              <div className="flex items-center gap-1 text-sm">
                                {status.isOverBudget ? (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <span className="text-destructive">超支</span>
                                  </>
                                ) : status.isNearLimit ? (
                                  <>
                                    <TrendingDown className="h-4 w-4 text-yellow-500" />
                                    <span className="text-yellow-500">接近预算</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <span className="text-green-600 dark:text-green-400">正常</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          <Input
                            id={`budget-${category}`}
                            type="number"
                            step="any"
                            min="0"
                            placeholder="设置预算金额"
                            value={budgetInputs[category] || ''}
                            onChange={(e) =>
                              setBudgetInputs({ ...budgetInputs, [category]: e.target.value })
                            }
                          />

                          {status && (
                            <div className="space-y-2 pt-2">
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>
                                  已支出: {formatAmount(status.spent)} / {formatAmount(status.budget)}
                                </span>
                                <span
                                  className={
                                    status.remaining < 0
                                      ? 'text-destructive'
                                      : 'text-green-600 dark:text-green-400'
                                  }
                                >
                                  剩余: {formatAmount(status.remaining)}
                                </span>
                              </div>
                              <Progress
                                value={status.spent}
                                max={status.budget}
                                indicatorClassName={
                                  status.isOverBudget
                                    ? 'bg-destructive'
                                    : status.isNearLimit
                                    ? 'bg-yellow-500'
                                    : 'bg-primary'
                                }
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 保存按钮 */}
                <Button onClick={handleSaveBudgets} className="w-full">
                  保存预算设置
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* 消息提示 */}
        {message && (
          <div className="mb-4 text-center text-sm text-green-600 dark:text-green-400">
            {message}
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 点击卡片展开设置经济画像和预算</p>
          <p className="mt-2">AI将根据你的实际情况提供个性化理财建议</p>
        </div>
      </main>
    </div>
  )
}

