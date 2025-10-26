'use client'

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react'
import { Plus, X, Loader2, FileImage, FileText, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ImageUploadProps {
  onImageUpload: (filename: string, base64?: string) => void
  onImageRemove: () => void
  currentImage?: string
  disabled?: boolean
}

export function ImageUpload({ 
  onImageUpload, 
  onImageRemove, 
  currentImage,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(
    currentImage || null
  )
  const [fileType, setFileType] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 监听currentImage变化，同步更新preview
  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage)
    } else {
      // 当currentImage被清空时，重置所有状态
      setPreview(null)
      setFileType('')
      setError('')
    }
  }, [currentImage])

  const processFile = async (file: File) => {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setError('只支持PNG、JPG、SVG、PDF格式')
      return
    }

    // 验证文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过10MB')
      return
    }

    setError('')
    setIsUploading(true)

    try {
      // 记录文件类型
      setFileType(file.type)

      let base64Data: string | undefined

      // 创建预览（仅图片）
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string
            setPreview(result)
            resolve(result)
          }
          reader.readAsDataURL(file)
        })
        base64Data = await base64Promise
      } else {
        setPreview('pdf') // PDF标记
      }

      // 上传文件
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '上传失败')
      }

      const data = await response.json()
      // 使用 Supabase 返回的完整 URL，而不是文件名
      onImageUpload(data.url, base64Data)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : '上传失败，请重试')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    await processFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setFileType('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageRemove()
  }

  const handleClick = () => {
    // 如果已有图片，点击打开预览而非上传
    if (preview || currentImage) {
      // 不是PDF才能预览
      const ext = currentImage?.split('.').pop()?.toLowerCase()
      if (preview !== 'pdf' && ext !== 'pdf') {
        setIsPreviewOpen(true)
        return
      }
    }
    
    // 没有图片时，点击上传
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  // 渲染预览内容
  const renderPreview = () => {
    if (preview === 'pdf') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <FileText className="h-12 w-12 text-destructive" />
        </div>
      )
    }
    if (preview && preview.startsWith('data:image')) {
      return (
        <Image
          src={preview}
          alt="附件"
          fill
          className="object-cover"
        />
      )
    }
    if (currentImage) {
      const ext = currentImage.split('.').pop()?.toLowerCase()
      if (ext === 'pdf') {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-destructive" />
          </div>
        )
      }
      return (
        <Image
          src={currentImage}
          alt="附件"
          fill
          className="object-cover"
        />
      )
    }
    return null
  }

  // 获取预览图片URL
  const getPreviewUrl = () => {
    if (preview && preview.startsWith('data:image')) {
      return preview
    }
    if (currentImage && !currentImage.endsWith('.pdf')) {
      return currentImage
    }
    return null
  }

  return (
    <>
      <div className="inline-block">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-20 h-20 border-2 rounded-lg cursor-pointer transition-all group
            ${preview || currentImage 
              ? 'border-solid border-border hover:border-primary' 
              : 'border-dashed border-muted-foreground/30 hover:border-primary hover:bg-accent/50'
            }
            ${isDragging ? 'border-primary bg-accent/50 scale-105' : ''}
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
        {isUploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : preview || currentImage ? (
          <>
            <div className="relative w-full h-full overflow-hidden rounded-md">
              {renderPreview()}
              {/* 悬停放大提示 - 仅图片显示 */}
              {getPreviewUrl() && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors shadow-lg z-10"
              disabled={disabled || isUploading}
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>

      {/* 图片预览对话框 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center bg-black/5 dark:bg-black/20">
            {getPreviewUrl() && (
              <Image
                src={getPreviewUrl()!}
                alt="图片预览"
                width={1200}
                height={800}
                className="object-contain max-h-[85vh]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

