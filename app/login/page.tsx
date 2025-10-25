'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccount } from '@/contexts/AccountContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAccount()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // 验证账号和密码
    const validUsers = ['user1', 'user2', 'user3']
    const correctPassword = 'xiaohongshu'

    if (!validUsers.includes(username)) {
      setError('账号不存在，请输入 user1、user2 或 user3')
      setIsSubmitting(false)
      return
    }

    if (password !== correctPassword) {
      setError('密码错误')
      setIsSubmitting(false)
      return
    }

    // 登录成功
    login(username as 'user1' | 'user2' | 'user3')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">理想生活记账本</CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            登录您的账号开始记账
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 账号 */}
            <div className="space-y-2">
              <Label htmlFor="username">账号</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入账号 (user1/user2/user3)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="username"
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="current-password"
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            )}

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登录中...' : '登录'}
            </Button>

            {/* 提示信息 */}
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>💡 可用账号：user1、user2、user3</p>
              <p>🔐 统一密码：xiaohongshu</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

