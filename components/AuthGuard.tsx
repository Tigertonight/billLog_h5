'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAccount } from '@/contexts/AccountContext'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn } = useAccount()

  useEffect(() => {
    // 如果未登录且不在登录页，则重定向到登录页
    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login')
    }
    // 如果已登录且在登录页，则重定向到首页
    if (isLoggedIn && pathname === '/login') {
      router.push('/')
    }
  }, [isLoggedIn, pathname, router])

  // 登录页直接显示
  if (pathname === '/login') {
    return <>{children}</>
  }

  // 未登录时显示空白或加载状态
  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}

