import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

const ALLOWED_EMAILS = [
  'chen@chensheffer.com',
  'chenshef@gmail.com',
]

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/tasks.readonly',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email && ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
        return true
      }
      return false
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.email = token.email || ''
      }
      session.accessToken = token.accessToken
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/verify-totp`
      }
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
}
