import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

const ALLOWED_EMAILS = [
  'chen@chensheffer.com',
  'chenshef@gmail.com',
]

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw data
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in ?? 3600) * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
      error: undefined,
    }
  } catch (error) {
    console.error('RefreshAccessTokenError', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly',
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
      // Initial sign-in: store tokens and expiry
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = Date.now() + ((account.expires_in as number) ?? 3600) * 1000
        return token
      }

      // Token still valid (with 60-second buffer)
      if (Date.now() < ((token.accessTokenExpires as number) ?? 0) - 60000) {
        return token
      }

      // Token expired — attempt refresh
      return refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.email = token.email || ''
      }
      session.accessToken = token.accessToken
      session.error = token.error
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
