# 记账H5页面功能PRD

## 一、产品定位与目标
本记账H5页面采用Next.js前端架构、本地CSV文件后端存储、shadcn风格UI，设计风格简洁友好现代化，参考苹果系统设计，支持明暗模式切换。核心目标是为用户提供便捷的记账功能，通过调用deepseek接口进行数据的分析和解读，给出省钱小贴示建议及优化话费的建议，同时允许用户在“我的”模块定义经济画像和目标，让AI定制化给出建议，且实现多账号数据隔离。

## 二、核心页面

### 1. 首页（快速记账页）
- **页面结构**
  - 顶部：显示“理想生活记账本”标题，右侧有账号切换下拉框（可选择user1、user2、user3等模拟账号）和明暗模式切换按钮。
  - 中间：记账表单区域，包含以下字段：
    - 消费分类选择框：预设餐饮、购物、娱乐、美妆等常见分类。
    - 金额输入框：用于输入消费金额，支持数字输入。
    - 日期选择器：默认选中当前日期，用户可自行修改消费日期。
    - 备注输入框：可选填，用于记录消费的具体详情，如“楼下拿铁”“新衣服”等。
  - 底部：“保存记录”按钮，点击后将记账信息保存。
- **核心交互功能**
  - 用户填写消费分类、金额、日期、备注等信息后，点击“保存记录”按钮，系统将数据存储到当前登录账号对应的CSV文件中。
  - 保存成功后，自动清空金额、备注输入框，方便用户进行下一次记账操作。
  - 点击明暗模式切换按钮，可在深色模式和浅色模式之间切换，切换状态会被本地存储记录，下次打开页面保持该模式。
  - 选择不同账号时，页面会加载对应账号的记账数据，实现数据隔离。

### 2. 统计分析页
- **页面结构**
  - 顶部：显示“消费统计”标题，下方有“获取AI省钱建议”按钮。
  - 中间：分为左右两个区域，左侧展示消费分类占比饼图，右侧展示消费趋势柱状图。
  - 底部：AI建议展示区域，初始为空，点击“获取AI省钱建议”按钮后显示AI分析结果。
- **核心交互功能**
  - 页面加载时，自动获取当前账号的消费数据，计算各消费分类的占比并生成饼图，按日期统计消费金额生成柱状图展示消费趋势。
  - 点击“获取AI省钱建议”按钮，系统调用deepseek接口，将消费数据（分类占比、趋势等）发送给接口，获取AI给出的3条省钱小建议和优化消费的具体方法，并在底部区域展示。
  - 图表支持交互，鼠标悬停在饼图的不同扇区或柱状图的柱子上时，会显示具体的分类名称、占比或日期、消费金额等信息。

### 3. 时间线记录页
- **页面结构**
  - 顶部：显示“消费时间线”标题。
  - 中间：按时间倒序（最新的记录在最上方）展示当前账号的所有消费记录，每条记录包含日期、分类、金额、备注等信息，每条记录右侧有“编辑”和“删除”按钮。
- **核心交互功能**
  - 点击某条记录的“编辑”按钮，弹出编辑表单，表单中预填该记录的信息，用户修改后点击“保存”按钮，更新CSV文件中对应的数据，页面同步刷新展示修改后的记录。
  - 点击“删除”按钮，弹出确认删除对话框，用户确认后，删除CSV文件中对应的记录，页面同步移除该条记录。
  - 页面支持下拉刷新，下拉到底部后松开，可重新加载最新的消费记录。

### 4. 预算管理页
- **页面结构**
  - 顶部：显示“预算管理”标题。
  - 中间：按消费分类展示预算设置项，每个分类包含预算金额输入框和预算使用进度条（已消费金额/预算金额）。
  - 底部：“保存预算”按钮。
- **核心交互功能**
  - 用户在各分类的预算金额输入框中输入月度预算金额，点击“保存预算”按钮，将预算信息存储到对应账号的本地数据中。
  - 系统实时计算各分类的已消费金额与预算金额的比例，通过进度条展示预算使用情况，当已消费金额超过预算金额时，进度条显示为红色提醒。
  - 页面会自动对比当前月份的消费数据与预算数据，在进度条旁显示已消费金额和剩余预算金额。

### 5. “我的”页面
- **页面结构**
  - 顶部：显示当前登录账号信息和账号切换下拉框。
  - 中间：分为经济画像设置区域和目标设置区域。
    - 经济画像设置区域：包含月收入输入框、主要消费分类输入框（可输入多个，用逗号分隔）、其他说明文本框。
    - 目标设置区域：包含每月储蓄目标输入框。
  - 底部：“生成定制化省钱建议”按钮和AI建议展示区域。
- **核心交互功能**
  - 用户填写经济画像信息（月收入、主要消费分类、其他说明）和每月储蓄目标后，点击“生成定制化省钱建议”按钮，系统调用deepseek接口，将这些信息发送给接口，获取AI根据用户画像和目标给出的至少3条详细建议，并在底部区域展示。
  - 账号切换功能与首页一致，切换账号后，页面展示对应账号的经济画像和目标设置信息。
  - 用户填写的经济画像和目标信息会存储到对应账号的本地数据中，下次打开页面自动加载。

## 三、信息架构
- **数据存储**：用户数据按账号隔离，每个账号对应一个独立的CSV文件，存储该账号的消费记录，包括id、date（日期）、category（分类）、amount（金额）、note（备注）等字段。此外，每个账号还有本地存储的数据，包括预算设置、经济画像和目标设置等信息。
- **页面导航**：通过底部导航栏进行各页面之间的跳转，导航栏包含“记账”（首页）、“统计”（统计分析页）、“时间线”（时间线记录页）、“预算”（预算管理页）、“我的”（“我的”页面）五个选项，点击相应选项可切换到对应的页面。
- **明暗模式**：明暗模式的状态通过本地存储记录，无论在哪个页面切换模式，所有页面都会同步更新显示模式。
- **AI接口调用**：统计分析页和“我的”页面分别通过调用deepseek接口获取对应的AI建议，接口调用的参数为当前页面所需的相关数据（消费数据或经济画像与目标数据），返回结果直接在页面展示。

要实现这款满足薯队长需求且集成AI分析的记账H5应用，我们可以按照以下架构和代码模块进行开发：


### 一、技术架构与功能模块
- **前端**：Next.js 14（App Router）+ Shadcn UI + Tailwind CSS + Chart.js（可视化）+ Zustand（状态管理）
- **后端/存储**：本地CSV文件（多账号隔离）
- **AI集成**：DeepSeek API（消费分析、定制化建议）
- **核心功能**：快速记账、数据可视化（饼图/折线图）、时间线记录、预算管理、多账号隔离、明暗模式、经济画像AI建议


### 二、代码实现（关键模块）

#### 1. 项目初始化与依赖安装
```bash
npx create-next-app@latest ideal-account-book
cd ideal-account-book
npm install @shadcn/ui @tailwindcss/forms chart.js recharts
npx shadcn-ui@latest init
```


#### 2. 明暗模式与主题配置
`tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        dark: {
          background: '#121212',
          card: '#1E1E1E',
          text: '#EAEAEA',
        },
        light: {
          background: '#F5F5F7',
          card: '#FFFFFF',
          text: '#1D1D1F',
        },
      },
    },
  },
  plugins: [],
}
```

`components/ui/theme-provider.jsx`
```jsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.add(savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    const newTheme = !isDark ? 'dark' : 'light'
    document.documentElement.classList.remove(isDark ? 'dark' : 'light')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```


#### 3. 多账号隔离与CSV数据处理
`utils/csv.js`
```js
import fs from 'fs'
import path from 'path'

const CSV_DIR = path.join(process.cwd(), 'public', 'csv')

export const initMockAccounts = () => {
  const mockAccounts = ['user1', 'user2', 'user3']
  mockAccounts.forEach((userId) => {
    const csvPath = path.join(CSV_DIR, `${userId}.csv`)
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, 'id,date,category,amount,note,image\n')
      // 初始化各用户测试数据
      if (userId === 'user1') {
        fs.appendFileSync(csvPath, '1,2025-10-01,餐饮,30,楼下拿铁,/images/coffee.jpg\n2,2025-10-02,购物,200,新衣服,/images/clothes.jpg\n')
      } else if (userId === 'user2') {
        fs.appendFileSync(csvPath, '1,2025-10-01,娱乐,150,看电影,/images/movie.jpg\n2,2025-10-03,餐饮,50,午餐,/images/lunch.jpg\n')
      } else {
        fs.appendFileSync(csvPath, '1,2025-10-02,美妆,300,护肤品,/images/skincare.jpg\n2,2025-10-04,餐饮,80,火锅,/images/hotpot.jpg\n')
      }
    }
  })
}

export const fetchTransactions = async (userId) => {
  const csvPath = path.join(CSV_DIR, `${userId}.csv`)
  if (!fs.existsSync(csvPath)) return []
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(Boolean)
  if (lines.length === 0) return []
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) =>
    headers.reduce((obj, header, index) => {
      obj[header] = lines[1].split(',')[index]
      return obj
    }, {})
  )
}

export const writeTransaction = async (userId, transaction) => {
  const csvPath = path.join(CSV_DIR, `${userId}.csv`)
  const id = Date.now()
  const line = `${id},${transaction.date},${transaction.category},${transaction.amount},${transaction.note || ''},${transaction.image || ''}\n`
  fs.appendFileSync(csvPath, line)
  return { id, ...transaction }
}
```

`contexts/account.jsx`
```jsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { fetchTransactions } from '@/utils/csv'

const AccountContext = createContext()

export function AccountProvider({ children }) {
  const [currentAccount, setCurrentAccount] = useState('user1')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const loadTransactions = async () => {
      const data = await fetchTransactions(currentAccount)
      setTransactions(data)
    }
    loadTransactions()
  }, [currentAccount])

  const switchAccount = (account) => {
    setCurrentAccount(account)
  }

  return (
    <AccountContext.Provider value={{ currentAccount, transactions, switchAccount }}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  return useContext(AccountContext)
}
```


#### 4. DeepSeek AI集成
`utils/deepseek.js`
```js
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export const analyzeSpending = async (transactions) => {
  // 统计分类占比和趋势
  const categories = {}
  let total = 0
  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount)
    total += amount
    categories[tx.category] = (categories[tx.category] || 0) + amount
  })
  const categoryRatio = Object.entries(categories).map(([cat, amt]) => ({
    category: cat,
    ratio: (amt / total * 100).toFixed(2),
  }))

  const prompt = `请分析以下消费数据：分类占比${JSON.stringify(categoryRatio)}，请给出3条省钱小建议和优化消费的具体方法。`

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content
}

export const generateProfileAdvice = async (profile) => {
  const prompt = `用户经济画像：${JSON.stringify(profile)}。请根据其画像和省钱存钱目标，定制化给出至少3条详细建议。`

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content
}
```


#### 5. 页面组件实现
##### （1）快速记账页（首页）
`app/page.jsx`
```jsx
'use client'
import { useState } from 'react'
import { useAccount } from '@/contexts/account'
import { useTheme } from '@/components/ui/theme-provider'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export default function Home() {
  const { currentAccount, switchAccount } = useAccount()
  const { isDark, toggleTheme } = useTheme()
  const [category, setCategory] = useState('餐饮')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount) return
    const res = await fetch(`/api/csv/${currentAccount}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount, date, note, image }),
    })
    const data = await res.json()
    setAmount('')
    setNote('')
    setImage('')
  }

  return (
    <main className={`min-h-screen p-4 ${isDark ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">理想生活记账本</h1>
        <div className="flex gap-2">
          <Button onClick={toggleTheme}>{isDark ? '浅色模式' : '深色模式'}</Button>
          <Select value={currentAccount} onValueChange={switchAccount}>
            <SelectTrigger>
              <SelectValue placeholder="选择账号" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">用户1</SelectItem>
              <SelectItem value="user2">用户2</SelectItem>
              <SelectItem value="user3">用户3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <Card className={`w-full max-w-md mx-auto p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
        <h2 className="text-xl font-semibold mb-4">快速记账</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="消费分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="餐饮">餐饮</SelectItem>
                <SelectItem value="购物">购物</SelectItem>
                <SelectItem value="娱乐">娱乐</SelectItem>
                <SelectItem value="美妆">美妆</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="金额（元）"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="备注（比如“这家店的拉花真好看”）"
            />
            <Button type="submit">保存记录</Button>
          </div>
        </form>
      </Card>
    </main>
  )
}
```

##### （2）统计与AI分析页
`app/statistics/page.jsx`
```jsx
'use client'
import { useEffect, useState } from 'react'
import { useAccount } from '@/contexts/account'
import { useTheme } from '@/components/ui/theme-provider'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts'
import { analyzeSpending } from '@/utils/deepseek'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#f50']

export default function Statistics() {
  const { transactions } = useAccount()
  const { isDark } = useTheme()
  const [categoryData, setCategoryData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 处理分类占比
    const categories = {}
    let total = 0
    transactions.forEach((tx) => {
      const amount = parseFloat(tx.amount)
      total += amount
      categories[tx.category] = (categories[tx.category] || 0) + amount
    })
    const catData = Object.entries(categories).map(([name, value]) => ({
      name,
      value: (value / total * 100).toFixed(2),
    }))
    setCategoryData(catData)

    // 处理趋势数据
    const dateMap = {}
    transactions.forEach((tx) => {
      dateMap[tx.date] = (dateMap[tx.date] || 0) + parseFloat(tx.amount)
    })
    const trend = Object.entries(dateMap).map(([date, amount]) => ({
      date,
      amount,
    })).sort((a, b) => new Date(a.date) - new Date(b.date))
    setTrendData(trend)
  }, [transactions])

  const fetchAiAdvice = async () => {
    setIsLoading(true)
    try {
      const advice = await analyzeSpending(transactions)
      setAiAdvice(advice)
    } catch (error) {
      setAiAdvice('获取AI建议失败，请稍后再试。')
    }
    setIsLoading(false)
  }

  return (
    <main className={`min-h-screen p-4 ${isDark ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">消费统计</h1>
        <Button onClick={fetchAiAdvice} disabled={isLoading}>
          {isLoading ? '分析中...' : '获取AI省钱建议'}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
          <h2 className="text-xl font-semibold mb-4">分类占比</h2>
          <PieChart width="100%" height={300}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              fill={(entry, index) => COLORS[index % COLORS.length]}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '占比']} />
            <Legend />
          </PieChart>
        </Card>

        <Card className={`p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
          <h2 className="text-xl font-semibold mb-4">消费趋势</h2>
          <BarChart
            width="100%"
            height={300}
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip formatter={(value) => [`${value}元`, '消费金额']} />
            <RechartsLegend />
            <Bar dataKey="amount" name="每日消费" fill="#0088FE" />
          </BarChart>
        </Card>
      </div>

      {aiAdvice && (
        <Card className={`mt-6 p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
          <h2 className="text-xl font-semibold mb-4">AI省钱建议</h2>
          <div className="whitespace-pre-line">{aiAdvice}</div>
        </Card>
      )}
    </main>
  )
}
```

##### （3）经济画像与AI定制建议页
`app/profile/page.jsx`
```jsx
'use client'
import { useState } from 'react'
import { useTheme } from '@/components/ui/theme-provider'
import { Card } from '@/components/ui/card'
import { Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { generateProfileAdvice } from '@/utils/deepseek'

export default function Profile() {
  const { isDark } = useTheme()
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [spendingCategories, setSpendingCategories] = useState('餐饮,购物,娱乐')
  const [savingsGoal, setSavingsGoal] = useState('')
  const [note, setNote] = useState('')
  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!monthlyIncome || !savingsGoal) return
    const profile = {
      monthlyIncome,
      spendingCategories: spendingCategories.split(',').map(cat => cat.trim()),
      savingsGoal: parseFloat(savingsGoal),
      note,
    }
    setIsLoading(true)
    try {
      const advice = await generateProfileAdvice(profile)
      setAiAdvice(advice)
    } catch (error) {
      setAiAdvice('获取定制化建议失败，请稍后再试。')
    }
    setIsLoading(false)
  }

  return (
    <main className={`min-h-screen p-4 ${isDark ? 'bg-dark-background text-dark-text' : 'bg-light-background text-light-text'}`}>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">我的经济画像</h1>
      </header>

      <Card className={`max-w-2xl mx-auto p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
        <h2 className="text-xl font-semibold mb-4">定义你的经济状况</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">月收入（元）</label>
              <NumberInput value={monthlyIncome} onValueChange={setMonthlyIncome}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">主要消费分类（逗号分隔）</label>
              <Input
                value={spendingCategories}
                onChange={(e) => setSpendingCategories(e.target.value)}
                placeholder="例如：餐饮,购物,娱乐"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">每月储蓄目标（元）</label>
              <NumberInput value={savingsGoal} onValueChange={setSavingsGoal}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">其他说明</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：经常加班所以餐饮开销大，每月必须还房贷3000元"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '生成中...' : '生成定制化省钱建议'}
            </Button>
          </div>
        </form>
      </Card>

      {aiAdvice && (
        <Card className={`mt-6 max-w-2xl mx-auto p-6 ${isDark ? 'bg-dark-card' : 'bg-light-card'}`}>
          <h2 className="text-xl font-semibold mb-4">AI定制化省钱建议</h2>
          <div className="whitespace-pre-line">{aiAdvice}</div>
        </Card>
      )}
    </main>
  )
}
```


#### 6. 导航栏与布局整合
`components/layout/navbar.jsx`
```jsx
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home">
              <Link href="/">记账</Link>
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <Link href="/statistics">统计</Link>
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Link href="/timeline">时间线</Link>
            </TabsTrigger>
            <TabsTrigger value="budget">
              <Link href="/budget">预算</Link>
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Link href="/profile">我的</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  )
}
```

`app/layout.js`
```jsx
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AccountProvider } from '@/contexts/account'
import Navbar from '@/components/layout/navbar'

export const metadata = {
  title: '理想生活记账本',
  description: '为薯队长打造的简洁美观记账应用',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body>
        <ThemeProvider>
          <AccountProvider>
            <Navbar />
            {children}
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```


### 三、运行与测试
1. 初始化Mock账号数据：在`utils/csv.js`中调用`initMockAccounts()`（可在`app/page.jsx`的`useEffect`中执行一次）。
2. 配置DeepSeek API密钥：在`.env.local`中添加`DEEPSEEK_API_KEY=你的密钥`。
3. 启动项目：`npm run dev`，访问`http://localhost:3000`即可体验。


