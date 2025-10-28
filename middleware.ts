import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth()

    if (!session?.user) {
      const callbackUrl = request.url
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`, request.url)
      )
    }

    // 验证是否为管理员用户
    const adminUsers = process.env.ADMIN_USER?.split(',') || []
    const userLogin = session.user.email?.split('@')[0] || session.user.name || ''
    
    if (!adminUsers.includes(userLogin)) {
      // 非管理员用户，重定向到错误页面
      return NextResponse.redirect(
        new URL('/auth/error?error=AccessDenied', request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
