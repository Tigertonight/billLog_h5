'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { useAccount } from '@/contexts/AccountContext'
import { addTransaction } from '@/lib/csv'
import { getCurrentDate, generateId } from '@/lib/utils'
import { CategoryType } from '@/types'
import { Sparkles, Loader2 } from 'lucide-react'

const CATEGORIES: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']

export default function HomePage() {
  const { currentAccount, refreshTransactions } = useAccount()
  const [category, setCategory] = useState<CategoryType>('餐饮')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getCurrentDate())
  const [note, setNote] = useState('')
  const [image, setImage] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('') // 用于AI识别的base64预览
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证金额
    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setMessage('请输入有效的金额')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      await addTransaction(currentAccount, {
        date,
        category,
        amount: parseFloat(amount),
        note: note.trim(),
        image: image || undefined,
      })

      // 刷新交易记录
      await refreshTransactions()

      // 清空表单
      setAmount('')
      setNote('')
      setImage('')
      setImagePreview('')
      setDate(getCurrentDate())
      
      setMessage('success:记账成功！')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error adding transaction:', error)
      setMessage('记账失败，请重试')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 智能识别附件
  const handleSmartRecognition = async () => {
    if (!imagePreview) {
      setMessage('请先上传图片')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // 检查是否是PDF（不支持）
    if (image.endsWith('.pdf')) {
      setMessage('暂不支持PDF识别，仅支持图片格式')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setIsRecognizing(true)
    setMessage('')

    try {
      const response = await fetch('/api/ai/parse-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || '识别失败')
      }

      const { data } = result

      // 检查是否无法识别
      if (data.error === 'UNRECOGNIZABLE') {
        setMessage('warning:⚠️ AI无法理解本图片的含义，请手动填写或更换清晰的票据图片')
        setTimeout(() => setMessage(''), 5000)
        return
      }

      // AI识别结果直接覆盖所有字段
      // 如果AI返回null或空字符串，也将表单字段设为空
      if (data.amount !== null && data.amount !== undefined && data.amount !== '') {
        setAmount(data.amount.toString())
      } else {
        setAmount('') // AI未识别到，清空字段
      }

      if (data.category !== null && data.category !== undefined && data.category !== '') {
        setCategory(data.category)
      } else {
        setCategory('餐饮') // AI未识别到，恢复默认值
      }

      if (data.date !== null && data.date !== undefined && data.date !== '') {
        setDate(data.date)
      } else {
        setDate(getCurrentDate()) // AI未识别到，使用今天日期
      }

      if (data.note !== null && data.note !== undefined && data.note !== '') {
        setNote(data.note)
      } else {
        setNote('') // AI未识别到，清空字段
      }

      setMessage('success:✨ 智能识别完成！请确认信息是否正确')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Recognition error:', error)
      setMessage(error instanceof Error ? error.message : '识别失败，请手动填写')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsRecognizing(false)
    }
  }

  // 处理图片上传（保存base64用于识别）
  const handleImageUpload = (filename: string, base64?: string) => {
    setImage(filename)
    if (base64) {
      setImagePreview(base64)
    }
  }

  // 处理图片删除
  const handleImageRemove = () => {
    setImage('')
    setImagePreview('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部Toast提示 */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className={`p-4 rounded-lg shadow-lg text-sm text-center animate-in slide-in-from-top duration-300 ${
            message.startsWith('success:')
              ? 'bg-green-50 dark:bg-green-900/90 text-green-700 dark:text-green-100 border-2 border-green-200 dark:border-green-700'
              : message.startsWith('warning:')
              ? 'bg-orange-50 dark:bg-orange-900/90 text-orange-700 dark:text-orange-100 border-2 border-orange-200 dark:border-orange-700'
              : 'bg-red-50 dark:bg-red-900/90 text-red-700 dark:text-red-100 border-2 border-red-200 dark:border-red-700'
          }`}>
            {message.replace('success:', '').replace('warning:', '')}
          </div>
        </div>
      )}

      <Header title="理想生活记账本" />
      
      <main className="container mx-auto px-4 py-6 page-content">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">快速记账</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 消费分类 */}
              <div className="space-y-2">
                <Label htmlFor="category">消费分类</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              {/* 金额 */}
              <div className="space-y-2">
                <Label htmlFor="amount">金额（元）</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="请输入金额"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* 日期 */}
              <div className="space-y-2">
                <Label htmlFor="date">日期</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* 备注 */}
              <div className="space-y-2">
                <Label htmlFor="note">备注（选填）</Label>
                <Textarea
                  id="note"
                  placeholder="例如：楼下拿铁、新衣服..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              {/* 附件上传 */}
              <div className="space-y-2">
                <Label>附件（选填）</Label>
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      onImageRemove={handleImageRemove}
                      currentImage={image}
                      disabled={isSubmitting || isRecognizing}
                    />
                    {/* AI识别按钮 - 吸底毛玻璃效果 */}
                    {image && !image.endsWith('.pdf') && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSmartRecognition}
                          disabled={isSubmitting || isRecognizing}
                          className="w-full h-7 px-2 text-xs backdrop-blur-md bg-white/70 dark:bg-black/50 hover:bg-white/80 dark:hover:bg-black/60 border border-white/30 dark:border-white/20 shadow-md text-foreground transition-all rounded-md"
                        >
                          {isRecognizing ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              <span className="text-xs">识别中...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-1" />
                              <span className="text-xs">AI识别</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      仅支持 JPG、PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存中...' : '保存记录'}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* 使用说明 */}
        <div className="mt-6 text-center text-sm text-muted-foreground max-w-md mx-auto">
          <p>💡 填写消费信息后点击"保存记录"即可完成记账</p>
          <p className="mt-2">切换账号可管理不同账本的数据</p>
        </div>
      </main>
    </div>
  )
}

