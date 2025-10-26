'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useAccount } from '@/contexts/AccountContext'
import { updateTransaction, deleteTransaction } from '@/lib/csv'
import { formatDate, formatAmount } from '@/lib/utils'
import { Transaction, CategoryType } from '@/types'
import { Edit2, Trash2, Calendar, Tag, DollarSign, FileText, ImageIcon } from 'lucide-react'
import Image from 'next/image'

const CATEGORIES: CategoryType[] = ['餐饮', '购物', '娱乐', '美妆', '交通', '住房', '医疗', '其他']

export default function TimelinePage() {
  const { transactions, currentAccount, refreshTransactions } = useAccount()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 编辑表单状态
  const [editForm, setEditForm] = useState({
    category: '' as CategoryType,
    amount: '',
    date: '',
    note: '',
    image: '',
  })

  // 按日期倒序排列
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // 打开编辑对话框
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setEditForm({
      category: transaction.category as CategoryType,
      amount: transaction.amount.toString(),
      date: transaction.date,
      note: transaction.note || '',
      image: transaction.image || '',
    })
    setIsEditDialogOpen(true)
  }

  // 提交编辑
  const handleSubmitEdit = async () => {
    if (!editingTransaction || !editForm.amount || parseFloat(editForm.amount) <= 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateTransaction(currentAccount, {
        id: editingTransaction.id,
        date: editForm.date,
        category: editForm.category,
        amount: parseFloat(editForm.amount),
        note: editForm.note,
        image: editForm.image || undefined,
      })

      await refreshTransactions()
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert('更新失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 打开删除确认对话框
  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  // 确认删除
  const handleConfirmDelete = async () => {
    if (!deletingId) return

    setIsSubmitting(true)

    try {
      await deleteTransaction(currentAccount, deletingId)
      await refreshTransactions()
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('删除失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 按日期分组
  const groupByDate = (transactions: Transaction[]) => {
    const groups: Record<string, Transaction[]> = {}
    transactions.forEach((tx) => {
      if (!groups[tx.date]) {
        groups[tx.date] = []
      }
      groups[tx.date].push(tx)
    })
    return groups
  }

  const groupedTransactions = groupByDate(sortedTransactions)
  const dates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-background">
      <Header title="消费时间线" />
      
      <main className="container mx-auto px-4 py-6 page-content">
        {sortedTransactions.length > 0 ? (
          <div className="space-y-6">
            {dates.map((date) => {
              const dayTransactions = groupedTransactions[date]
              const dayTotal = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0)

              return (
                <div key={date}>
                  {/* 日期标题 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{formatDate(date)}</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      共 {formatAmount(dayTotal)}
                    </span>
                  </div>

                  {/* 该日期的交易列表 */}
                  <div className="space-y-2">
                    {dayTransactions.map((transaction) => (
                      <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="font-medium">{transaction.category}</span>
                                <span className="text-xl font-bold text-primary">
                                  {formatAmount(transaction.amount)}
                                </span>
                              </div>
                              {transaction.note && (
                                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{transaction.note}</span>
                                </div>
                              )}
                              {transaction.image && (
                                <div className="mt-2">
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                                    {transaction.image.endsWith('.pdf') ? (
                                      <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <FileText className="h-10 w-10 text-destructive" />
                                      </div>
                                    ) : (
                                      <Image
                                        src={transaction.image}
                                        alt="附件"
                                        fill
                                        className="object-cover"
                                      />
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)}
                                className="h-8 w-8"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(transaction.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">暂无消费记录</p>
                <p className="text-sm">请先在记账页面添加一些记录</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 编辑对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑记录</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">消费分类</Label>
                <Select
                  id="edit-category"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value as CategoryType })}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-amount">金额（元）</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">日期</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-note">备注</Label>
                <Textarea
                  id="edit-note"
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>附件</Label>
                <div className="flex items-center gap-2">
                  <ImageUpload
                    onImageUpload={(filename) => setEditForm({ ...editForm, image: filename })}
                    onImageRemove={() => setEditForm({ ...editForm, image: '' })}
                    currentImage={editForm.image}
                    disabled={isSubmitting}
                  />
                  <span className="text-xs text-muted-foreground">支持 PNG、JPG、SVG、PDF（编辑时不支持智能识别）</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            
            <p className="text-sm text-muted-foreground">
              确定要删除这条记录吗？此操作无法撤销。
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? '删除中...' : '确认删除'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

