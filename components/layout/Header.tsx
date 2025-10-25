'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useAccount } from '@/contexts/AccountContext'
import { Moon, Sun, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()
  const { currentAccount, logout } = useAccount()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getUserLabel = (account: string) => {
    switch (account) {
      case 'user1':
        return '账号1'
      case 'user2':
        return '账号2'
      case 'user3':
        return '账号3'
      default:
        return account
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {getUserLabel(currentAccount)}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              title="切换主题"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9"
              title="退出登录"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

