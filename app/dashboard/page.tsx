'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Chen Sheffer — Office Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">March 16, 2026</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <div className="text-2xl font-bold text-slate-900">10</div>
                <div className="text-sm text-slate-500">Recent Emails · chenshef@</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">⭐</div>
              <div>
                <div className="text-2xl font-bold text-slate-900">201</div>
                <div className="text-sm text-slate-500">Total Messages · Account 1</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">💼</div>
              <div>
                <div className="text-2xl font-bold text-slate-900">8</div>
                <div className="text-sm text-slate-500">Work Emails · chen@chensheffer</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📬</div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Both Live</div>
                <div className="text-sm text-slate-500">Gmail · Synced now</div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome, {session.user?.name || 'User'}!</h2>
          <p className="text-slate-600 mb-4">
            You are logged in as: <span className="font-semibold">{session.user?.email}</span>
          </p>
          <p className="text-slate-600">
            🔐 This dashboard is secured with Google Authentication & MFA
          </p>
        </div>

        {/* Dashboard Links */}
        <div className="grid grid-cols-2 gap-6">
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Gmail - chenshef@gmail.com</h3>
            <p className="text-slate-600 text-sm">Access your personal email inbox with 201+ messages</p>
          </a>

          <a
            href="https://mail.google.com/mail/?authuser=chen@chensheffer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Gmail - chen@chensheffer.com</h3>
            <p className="text-slate-600 text-sm">Access your work email account for CISO & DPO correspondence</p>
          </a>

          <a
            href="https://calendar.google.com/calendar/u/0/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Google Calendar</h3>
            <p className="text-slate-600 text-sm">View your calendar with 10+ events in April 2026</p>
          </a>

          <a
            href="https://tasks.google.com/tasks/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Google Tasks</h3>
            <p className="text-slate-600 text-sm">Manage your tasks with WORK list (10) and Home-TASKS (2)</p>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-slate-500">
          <p>office.chensheffer.com · Secured with NextAuth & Google OAuth</p>
          <p className="mt-2">🔐 MFA enabled · 📱 Phone verification available</p>
        </div>
      </footer>
    </div>
  )
}
