'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAccount } from '@/contexts/AccountContext'
import { analyzeSpending } from '@/lib/deepseek'
import { Bot, Sparkles, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function AIAdvicePage() {
  const { transactions } = useAccount()
  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  // 获取AI建议
  const fetchAIAdvice = async () => {
    if (transactions.length === 0) {
      setAiAdvice('暂无消费数据，请先添加一些记账记录。')
      return
    }

    setIsLoadingAI(true)
    setAiAdvice('')

    try {
      await analyzeSpending(transactions, (chunk) => {
        setAiAdvice((prev) => prev + chunk)
      })
    } catch (error) {
      console.error('Error fetching AI advice:', error)
      setAiAdvice('获取AI建议失败，请检查网络连接或稍后再试。')
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="AI建议" />
      
      <main className="container mx-auto px-4 py-6 page-content">
        {/* AI助手介绍 */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI理财助手
                </h2>
                <p className="text-sm text-muted-foreground">
                  我会分析您的消费数据，为您提供个性化的省钱建议和理财规划。点击下方按钮开始分析！
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI分析按钮 */}
        <div className="mb-6">
          <Button
            onClick={fetchAIAdvice}
            disabled={isLoadingAI || transactions.length === 0}
            className="w-full"
            size="lg"
          >
            {isLoadingAI ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI分析中...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-5 w-5" />
                获取AI省钱建议
              </>
            )}
          </Button>
        </div>

        {/* AI建议卡片 */}
        {aiAdvice && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI理财建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiAdvice}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {transactions.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">暂无消费数据</p>
                <p className="text-sm">请先在记账页面添加一些记录，AI助手将为您分析消费习惯</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用提示 */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 AI助手会根据您的消费数据提供个性化建议</p>
          <p className="mt-2">建议每周使用一次，帮助您更好地管理财务</p>
        </div>
      </main>
    </div>
  )
}

