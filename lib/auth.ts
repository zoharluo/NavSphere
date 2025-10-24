import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import type { DefaultSession, NextAuthConfig } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string
    } & DefaultSession['user']
  }
  interface JWT {
    accessToken?: string
  }
  interface User {
    accessToken?: string
  }
}

const config = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: 'repo' }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // 检查是否为管理员用户
      const adminUsers = process.env.ADMIN_USER?.split(',') || []
      const userLogin = user.email?.split('@')[0] || user.name || ''
      
      // 允许管理员用户登录
      if (adminUsers.includes(userLogin)) {
        return true
      }
      
      // 拒绝非管理员用户
      return false
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.GITHUB_SECRET
} satisfies NextAuthConfig

const handler = NextAuth(config)

export const auth = handler.auth
export const { handlers: { GET, POST } } = handler
