'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PenLine, BarChart3, Clock, Bot, User } from 'lucide-react'

const navItems = [
  { href: '/', label: '记账', icon: PenLine },
  { href: '/statistics', label: '统计', icon: BarChart3 },
  { href: '/timeline', label: '时间线', icon: Clock },
  { href: '/ai-advice', label: 'AI建议', icon: Bot },
  { href: '/profile', label: '我的', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()

  // 登录页面不显示导航栏
  if (pathname === '/login') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 text-xs transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", isActive && "stroke-[2.5]")} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

