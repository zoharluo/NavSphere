'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return '访问被拒绝：您没有管理员权限'
      case 'Configuration':
        return '配置错误'
      case 'Verification':
        return '验证失败'
      默认:
        return error || '发生未知错误'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">认证错误</h1>
        <p className="text-muted-foreground mb-4">
          {getErrorMessage(error)}
        </p>
        {error === 'AccessDenied' && (
          <p className="text-sm text-muted-foreground">
            请联系管理员获取访问权限
          </p>
        )}
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
} 
