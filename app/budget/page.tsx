'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function BudgetPage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到"我的"页面
    router.replace('/profile')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">正在跳转到"我的"页面...</p>
        <p className="text-sm text-muted-foreground mt-2">预算设置已移至"我的"页面</p>
      </div>
    </div>
  )
}

