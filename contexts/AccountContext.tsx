'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Transaction, Budget, EconomicProfile, AccountType } from '@/types'
import { fetchTransactions } from '@/lib/csv'

interface AccountContextType {
  currentAccount: AccountType
  transactions: Transaction[]
  budgets: Budget[]
  totalBudget: number
  profile: EconomicProfile | null
  isLoggedIn: boolean
  switchAccount: (account: AccountType) => void
  refreshTransactions: () => Promise<void>
  updateBudgets: (budgets: Budget[]) => void
  updateTotalBudget: (amount: number) => void
  updateProfile: (profile: EconomicProfile) => void
  login: (account: AccountType) => void
  logout: () => void
}

const AccountContext = createContext<AccountContextType>({
  currentAccount: 'user1',
  transactions: [],
  budgets: [],
  totalBudget: 0,
  profile: null,
  isLoggedIn: false,
  switchAccount: () => {},
  refreshTransactions: async () => {},
  updateBudgets: () => {},
  updateTotalBudget: () => {},
  updateProfile: () => {},
  login: () => {},
  logout: () => {},
})

export function AccountProvider({ children }: { children: ReactNode }) {
  const [currentAccount, setCurrentAccount] = useState<AccountType>('user1')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [totalBudget, setTotalBudget] = useState<number>(0)
  const [profile, setProfile] = useState<EconomicProfile | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 初始化账号数据
  useEffect(() => {
    setMounted(true)
    const savedAccount = localStorage.getItem('currentAccount') as AccountType
    const savedLoginStatus = localStorage.getItem('isLoggedIn') === 'true'
    
    if (savedAccount && ['user1', 'user2', 'user3'].includes(savedAccount)) {
      setCurrentAccount(savedAccount)
    }
    
    setIsLoggedIn(savedLoginStatus)
  }, [])

  // 加载交易记录
  const refreshTransactions = async () => {
    try {
      const data = await fetchTransactions(currentAccount)
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
      setTransactions([])
    }
  }

  // 当账号切换时，加载该账号的数据
  useEffect(() => {
    if (!mounted) return

    // 保存当前账号
    localStorage.setItem('currentAccount', currentAccount)

    // 加载交易记录
    refreshTransactions()

    // 加载预算数据
    const savedBudgets = localStorage.getItem(`budgets_${currentAccount}`)
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets))
      } catch (e) {
        setBudgets([])
      }
    } else {
      setBudgets([])
    }

    // 加载总预算
    const savedTotalBudget = localStorage.getItem(`totalBudget_${currentAccount}`)
    if (savedTotalBudget) {
      try {
        setTotalBudget(parseFloat(savedTotalBudget))
      } catch (e) {
        setTotalBudget(0)
      }
    } else {
      setTotalBudget(0)
    }

    // 加载经济画像
    const savedProfile = localStorage.getItem(`profile_${currentAccount}`)
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (e) {
        setProfile(null)
      }
    } else {
      setProfile(null)
    }
  }, [currentAccount, mounted])

  // 切换账号
  const switchAccount = (account: AccountType) => {
    setCurrentAccount(account)
  }

  // 更新预算
  const updateBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets)
    localStorage.setItem(`budgets_${currentAccount}`, JSON.stringify(newBudgets))
  }

  // 更新总预算
  const updateTotalBudget = (amount: number) => {
    setTotalBudget(amount)
    localStorage.setItem(`totalBudget_${currentAccount}`, amount.toString())
  }

  // 更新经济画像
  const updateProfile = (newProfile: EconomicProfile) => {
    setProfile(newProfile)
    localStorage.setItem(`profile_${currentAccount}`, JSON.stringify(newProfile))
  }

  // 登录
  const login = (account: AccountType) => {
    setCurrentAccount(account)
    setIsLoggedIn(true)
    localStorage.setItem('currentAccount', account)
    localStorage.setItem('isLoggedIn', 'true')
  }

  // 登出
  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  return (
    <AccountContext.Provider
      value={{
        currentAccount,
        transactions,
        budgets,
        totalBudget,
        profile,
        isLoggedIn,
        switchAccount,
        refreshTransactions,
        updateBudgets,
        updateTotalBudget,
        updateProfile,
        login,
        logout,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  return useContext(AccountContext)
}

